#!/usr/bin/env python3
from methods import build_map, plot_iso_map, make_intersect, format_data, pub_path
from data import save_graph, read_graph, df_from_publist, read_center
import time
import warnings
import json

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


def create_pub_route(publist=None):

    pubs_df = df_from_publist(publist)

    centroid = read_center('temps/temp_center')

    pub_path(pubs_df, centroid)










if __name__ == '__main__':
    create_pub_route(None)


    pass
