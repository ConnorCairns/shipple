from data import save_center
from scipy import stats
import geopandas as gpd
import matplotlib.pyplot as plt
import networkx as nx
import osmnx as ox
import numpy as np
import shapely

ox.config(use_cache=True, log_console=False)


def format_data(coords_list=None):
    """
    Does some stats and stuff
    :return:
    """

    if coords_list is None:
        mvb = (51.45591, -2.603067)
        cd = (51.4648, -2.6254)
        kd = (51.462553, -2.597698)
        coords_list = [mvb, cd, kd]

        # Random number generator (TO DO)
        # np.random.seed(69)
        # generated = np.random.normal(loc=0, scale=1, size=(5,2))
        # print(generated+coords_list)

    # Standardise data to mean = 0, std = 1
    standard = stats.zscore(coords_list, axis=0)

    # replace all coords outside 2 stdvs from the mean with NaNs
    z = [coords_list[idx] if np.abs(np.mean(coord)) < 2 else np.NaN for idx, coord in enumerate(standard)]

    # remove NaNs (only NaNs are not equal to themselves)
    feasible_coords = filter(lambda v: v == v, z)

    # remove any recurring values
    feasible_coords = list(set(feasible_coords))

    # Find row-wise mean
    mean = np.mean(feasible_coords, axis=0)

    return mean, feasible_coords


def build_map(center_point, dist, ntype):
    """
    Returns a map given the center point
    :param center_point: coords of the center poing (lat, long)
    :param dist:
    :param ntype:
    :return:
    """

    # Build graph
    G = ox.graph_from_point(center_point, dist=dist, network_type=ntype, simplify=True)

    return G


def get_isochrone(G, coords, walk_time=10, speed=4.5):
    """
    Finds the isochrone of given a speed and coordinate.
    :param G: Graph object
    :param coords: set of coordinates
    :param walk_time:
    :param speed:
    :return: Polygon of the isochrone
    """
    # find the centermost node and then project the graph to UTM
    y, x = coords
    center_node = ox.get_nearest_node(G, (y, x))

    # add an edge attribute for time in minutes required to traverse each edge
    meters_per_minute = speed * 1000 / 60  # km per hour to m per minute
    for u, v, k, data in G.edges(data=True, keys=True):
        data['time'] = data['length'] / meters_per_minute

    subgraph = nx.ego_graph(G, center_node, radius=walk_time, distance='time')
    node_points = [shapely.geometry.Point(data['x'], data['y']) for node, data in subgraph.nodes(data=True)]
    poly = gpd.GeoSeries(node_points).unary_union.convex_hull

    return poly


def make_intersect(coords, map_):
    """
    iteratively increases the walking time until an intersection is made
    :param coords:
    :param map_:
    :return:
    """
    walking_time = 15
    intersection_ = shapely.geometry.Polygon()
    while intersection_.is_empty:
        # increase walking time until there is a
        walking_time += 3
        polys = [get_isochrone(map_, coord, walk_time=walking_time) for coord in coords]
        intersection_ = check_intersect(polys)

    save_center('temps/temp_center', intersection_.centroid)
    walking_time = walking_time + 3
    polys = [get_isochrone(map_, coord, walk_time=walking_time) for coord in coords]
    intersection_ = check_intersect(polys)

    return polys, intersection_


def intersection(poly1, poly2):
    return poly1.intersection(poly2)


def check_intersect(polys):
    """
    Recursively checks if there is an intersection between all of the isochrones.
    :param polys:
    :return:
    """
    intersectionResult = None

    for j, poly in enumerate(polys[:-1]):

        # first loop is 0 & 1
        if j == 0:
            polyA = poly
            polyB = polys[j + 1]
        # use the result if the intersection
        else:
            polyA = intersectionResult
            polyB = polys[j + 1]

        intersectionResult = intersection(polyA, polyB)

    return intersectionResult


def plot_iso_map(G, polys, intersect=None):
    """
    Plots the isochrones of each coordinate
    :param G:
    :param polys:
    :return:
    """

    fig, ax = ox.plot_graph(G, bgcolor="k", node_color='blue', node_size=2, edge_linewidth=2, edge_color="#333333",
                            show=False)
    for poly in polys:
        plt.plot(*poly.exterior.xy, c='red', linestyle=':')

    if intersect is not None:
        plt.fill(*intersect.exterior.xy, fc='g', alpha=0.2)

    plt.show()


####### Pub search stuff #######


def pub_path(pubs_df, centroid):
    # calculates an array of the
    pubs_df['dist_to_centroid'] = [np.linalg.norm(centroid - np.array([pubs_df['lat'][i], pubs_df['long'][i]]))
                                   for i in range(len(pubs_df))]
