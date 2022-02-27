import scipy
import numpy as np


def get_carbon_savings(first_pub, pubs, coords):
    """
    Estimates the C02 emissions reduced by estimating the average distance to a random pub by sampling, and comparing
    it to the average distance of the participants location to the chosen starting point.
    :param coords: list of participant locations
    :param first_pub: our proposed pub coordinates
    :param pubs: a dataframe of all the pubs
    :return: a number of c02 savings
    """

    # make a randomly sampled df from 40% of the total pubs in the map
    chosen_pub_df = pubs.sample(n=0.4)

    # prius c02(g)/km
    c02_prius_const = 89

    # Find the total c02 to each pub
    c02_vals = np.zeros(len(chosen_pub_df))

    # upper limit of walking tolerance (minutes)
    upper_limit = 30
    avg_driving_speed = 18

    # calculate the sum of distances to each pub
    for index, pub in chosen_pub_df.itterows():
        # iterate over the pubs, find lat and long of the pub
        lat, long = pub['lat'], pub['long']
        total_c02 = 0
        for i in range(len(coords)):
            # calculate the euclidean distance between this pub and every coordinate. convert this value to m
            distance = np.linalg.norm(np.array([lat, long]) - np.array([coords[i][0], coords[i][1]])) * 111139

            # Convert distance to time
            journey_time = distance / (4500 / 60 ** 2)

            # time spent driving is 4.5/18 of the time walking (trust me bro)
            time_driving = (journey_time * (4.5 / avg_driving_speed)) * 2 if (journey_time - upper_limit) > 0 else 0

            # running total of c02 per pub
            total_c02 += 18 * time_driving * c02_prius_const

        # c02 usage for this pub is
        c02_vals[index] = total_c02

    # average c02 value for the sampled pubs
    mean_c02 = np.mean(c02_vals)

    # find the total c02 from our proposed pub
    plat, plong = first_pub

    optimised_c02 = 0
    for i in range(coords):
        lat, long = coords[i][0], coords[i][1]

        distance = np.linalg.norm(np.array(plat, plong) - np.array(lat, long))

        journey_time = distance / (4500 / 60 ** 2)

        time_driving = (journey_time * (4.5 / avg_driving_speed)) * 2 if (journey_time - upper_limit) > 0 else 0

        optimised_c02 += 18 * time_driving * c02_prius_const

    c02_savings = mean_c02-optimised_c02

    return c02_savings

