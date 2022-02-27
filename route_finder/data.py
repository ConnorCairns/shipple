import networkx as nx
import pickle
import numpy as np
import pandas as pd


def save_graph(filename, g):
    nx.readwrite.write_gpickle(g, filename)


def read_graph(filename):
    g = nx.readwrite.read_gpickle(filename)
    return g


def save_center(filename, center):
    with open(filename, 'wb') as f:
        pickle.dump(center, f)


def read_center(filename):
    with open(filename, 'rb') as f:
        center = pickle.load(f)
    return center


def df_from_publist(publist=None):
    """
    Turns the publist into a dataframe for easier manipulation
    :param publist:
    :return:
    """
    if publist is None:
        publist = [
        [
            "Dristi’s",
            51.4592495,
            -2.6111314
        ],
        [
            "Bundys",
            51.4588478,
            -2.6106816
        ],
        [
            "The Balloon",
            51.4565586,
            -2.6132752
        ],
        [
            "Steam",
            51.464551,
            -2.6118533
        ],
        [
            "Channings",
            51.4588436,
            -2.6143926
        ],
        [
            "Victoria",
            51.4596477,
            -2.6110328
        ],
        [
            "Barrel House",
            51.4563176,
            -2.6131876
        ],
        [
            "The Eldon House",
            51.4547651,
            -2.6105008
        ],
        [
            "Bar 135",
            51.46498,
            -2.6097405
        ],
        [
            "The Whitmore Tap",
            51.4643683,
            -2.6094535
        ],
        [
            "The W.G. Grace",
            51.4629398,
            -2.6087799
        ],
        [
            "Flipside",
            51.4641479,
            -2.6093529
        ],
        [
            "Bravas",
            51.4643119,
            -2.6090308
        ],
        [
            "Alterego",
            51.4630836,
            -2.6089308
        ],
        [
            "Bar Humbug",
            51.4634883,
            -2.6090085
        ],
        [
            "Brewhouse & Kitchen",
            51.4641458,
            -2.6085228
        ],
        [
            "Noto",
            51.4646727,
            -2.6100476
        ],
        [
            "Convivio",
            51.4635377,
            -2.6073331
        ],
        [
            "Crying Wolf",
            51.4639537,
            -2.6083333
        ],
        [
            "Chums",
            51.467913,
            -2.6053169
        ],
        [
            "The Good Measure",
            51.4672439,
            -2.6071252
        ],
        [
            "Vittoria",
            51.4620967,
            -2.6085036
        ],
        [
            "The Alma",
            51.4625294,
            -2.6146686
        ],
        [
            "The Lost & Found",
            51.4569781,
            -2.6086941
        ],
        [
            "Brace & Browns",
            51.4616075,
            -2.6082064
        ],
        [
            "Quinton House",
            51.457075,
            -2.6093414
        ],
        [
            "The Clyde",
            51.4687294,
            -2.6090995
        ],
        [
            "Pampam",
            51.4578471,
            -2.6081619
        ],
        [
            "Her Majesty's Secret Service",
            51.4645228,
            -2.6103836
        ],
        [
            "Shebeen",
            51.4644748,
            -2.6118349
        ]
    ]

    # declare lengths
    lats, longs = [np.zeros(len(publist))]*2
    pub_names = [""]*len(publist)

    # assign values to the columns
    for idx, pub in enumerate(publist):
        lats[idx], longs[idx], pub_names[idx] = pub[0], pub[1], pub[2]

    df = pd.DataFrame()

    # make df columns
    df['lat'], df['long'], df['pub_names'] = lats, longs, pub_names

    return df
