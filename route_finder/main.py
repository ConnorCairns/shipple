#!/usr/bin/env python3
from pandas import DataFrame
from methods import build_map, plot_iso_map, make_intersect, format_data, pub_path
from data import save_graph, read_graph, df_from_publist, read_center
import time
import warnings
import json
import numpy as np

warnings.filterwarnings("ignore", category=UserWarning)


def find_bounding_poly(data=None):

    # create the coordinate list, removing outliers etc...
    center, coords_list = format_data(coords_list=data)

    # build the map using a central point
    map_ = build_map(center, dist=3000, ntype="walk")

    # make the list of isochrone polygons
    polys, intersection = make_intersect(coords_list, map_)

    # make poly list in the correct [lat,long,lat,long...] form
    poly_list = [list(reversed(x)) for x in intersection.exterior.coords[:]]
    poly_list = [item for sublist in poly_list for item in sublist]

    # turn list into a json.
    out = json.dumps({'coords': poly_list}, sort_keys=True, indent=4)
    print(out)

    plot = False
    if plot:
        plot_iso_map(map_, polys, intersect=intersection)

    return out


def euclidean_distance(coord1, coord2):
    c1 = np.array(coord1)
    c2 = np.array(coord2)
    return np.linalg.norm(c1, c2)


def closest_pub(pubs, coordinate):
    return min([i for i in range(len(pubs))], key=lambda i: euclidean_distance(pubs[i][1:], coordinate))


def create_pub_route(publist=None):
    NUM_PUBS = 5

    pubs_df = df_from_publist(publist)
    centroid = read_center('temps/temp_center')
    pub_path(pubs_df, centroid)

    pubs = pubs_df.values.tolist()

    central_pub_index = closest_pub(pubs, centroid)
    central_pub = pubs.pop(central_pub_index)

    selected_pubs = [central_pub]

    for _ in range(NUM_PUBS - 1):
        # find the closest pub to each of the end points
        start_pub = selected_pubs[0]
        end_pub = selected_pubs[-1]

        i_s = closest_pub(pubs, start_pub[1:])
        i_e = closest_pub(pubs, end_pub[1:])

        # choose the closest one of these to add to the selected list
        if euclidean_distance(start_pub[1:], pubs[i_s][1:]) < euclidean_distance(end_pub[1:], pubs[i_e][1:]):
            new_pub = pubs.pop(i_s)
            selected_pubs = [new_pub] + selected_pubs
        else:
            new_pub = pubs.pop(i_e)
            selected_pubs.append(new_pub)

    return selected_pubs


if __name__ == '__main__':
    create_pub_route(None)
    pass
