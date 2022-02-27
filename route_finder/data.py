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
                41.6404497,
                -2.6148035,
                "Bar Fr\u00edas"
            ],
            [
                50.9448398,
                -2.6157217,
                "Pen Mill Hotel"
            ],
            [
                51.4565586,
                -2.6132752,
                "The Balloon"
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
