#!/usr/bin/env python3
from methods import build_map, plot_iso_map, make_intersect,format_data
import time
import warnings
import json

warnings.filterwarnings("ignore", category=UserWarning)


def main(data=None):

    center, coords_list = format_data(coords_list=data)

    # build the map using a central point
    map_ = build_map(center, dist=3000, ntype="walk")

    # make the list of isochrone polygons
    polys, intersection = make_intersect(coords_list, map_)

    poly_list = [list(reversed(x)) for x in intersection.exterior.coords[:]]

    poly_list = [item for sublist in poly_list for item in sublist]

    out = json.dumps({'coords': poly_list}, sort_keys=True, indent=4)
    print(out)

    plot = False
    if plot:
        plot_iso_map(map_, polys, intersect=intersection)


    return out


if __name__ == '__main__':
    out_poly = main()
