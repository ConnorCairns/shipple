from scipy import stats
import geopandas as gpd
import matplotlib.pyplot as plt
import networkx as nx
import osmnx as ox
import numpy as np
import shapely
import json

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

        # Random number generator
        # np.random.seed(69)
        # generated = np.random.normal(loc=0, scale=1, size=(5,2))
        # print(generated+coords_list)

    # Find row-wise means

    # Standardise data to mean = 0, std = 1
    standard = stats.zscore(coords_list, axis=0)

    # replace all coords outside 2 stdvs from the mean with NaNs
    z = [coords_list[idx] if np.abs(np.mean(coord)) < 2 else np.NaN for idx, coord in enumerate(standard)]

    # remove NaNs (only NaNs are not equal to themselves)
    feasible_coords = filter(lambda v: v == v, z)

    feasible_coords = list(set(feasible_coords))

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

def get_poly(data):
    print("1")
    center, coords_list = format_data(coords_list=data)
    print("2")
    # build the map using a central point
    map_ = build_map(center, dist=3000, ntype="walk")
    print("3")
    # make the list of isochrone polygons
    polys, intersection = make_intersect(coords_list, map_)
    print("4")
    poly_list = [list(reversed(x)) for x in intersection.exterior.coords[:]]
    print("5")
    poly_list = [item for sublist in poly_list for item in sublist]
    print("6")
    # out = json.dumps({'coords': poly_list}, sort_keys=True, indent=4)
    # print(poly_list)

    plot = False
    if plot:
        plot_iso_map(map_, polys, intersect=intersection)

    return poly_list

def parse_pubs(data):
    # print(f"A - {data}")
    query_parameters = data

    # print((query_parameters["elements"][0]["tags"]["name"]))
    nodes = {}
    ways = {}
    lst = []
    for pub in (query_parameters["elements"]):
        # print(pub)
        if pub["type"] in ["node", "way"]:
            if "nodes" in pub.keys():
                if "tags" in pub.keys():
                    if "name" in pub["tags"].keys():
                        name = pub["tags"]["name"]
                        ways[pub["nodes"][0]] = name
                else:
                    pass
                    # nodes[pub["id"]] = pub["nodes"][0]
            else:
                lat = pub["lat"]
                long = pub["lon"]
                if "tags" in pub.keys():
                    if "name" in pub["tags"].keys():
                        name = pub["tags"]["name"]
                    else:
                        name = "NULL"
                    lst.append([name, lat, long])
                    # print(f"{lat} - {long} - {name}")
                else:
                    nodes[pub["id"]] = [lat, long]
        # elif pub["type"] == "way":
        #     if "name" in pub["tags"].keys():
        #         name = pub["tags"]["name"]
        #         ways[pub["nodes"][0]] = name

    for id, name in ways.items():
        lat, long = nodes[id]
        lst.append([name, lat, long])

    # print(lst)

    for pub in lst:
        print(f"{pub[1]} - {pub[2]} - {pub[0]}")

    return lst