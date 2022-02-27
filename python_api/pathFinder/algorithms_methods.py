import numpy as np
import requests

from pathFinder import methods
QUERY = """http://www.overpass-api.de/api/interpreter?data=
[out:json][timeout:25];
(
  node["amenity"="pub"]    ({0});
  way["amenity"="pub"]     ({0});
  node["amenity"="bar"]    ({0});
  way["amenity"="bar"]     ({0});
);
out body;
>;
out skel qt;"""

def distance(x1, x2, y1, y2):
    return np.sqrt((x1-x2)**2 + (x1-x2)**2)

def get_pubs_in_box(lat1,lon1,lat2,lon2):
    url = QUERY.format(f'{lat1},{lon1},{lat2},{lon2}')

    r = requests.get(url)
    data = r.json()

    parsed_data = methods.parse_pubs(data)

    for i in range(len(parsed_data)):
        parsed_data[i][1] = float(parsed_data[i][1])
        parsed_data[i][2] = float(parsed_data[i][2])

    return parsed_data

def get_mean_of_pub_locations(pub_json_data):
    pub_location_data = [(pub[1], pub[2]) for pub in pub_json_data]

    pub_array = np.array(pub_location_data)

    x_mean = np.mean(pub_array[:,0])
    y_mean = np.mean(pub_array[:,1])

    return x_mean, y_mean

# Note that 1 lat/long degree = ~111 km
def get_clever_mean_of_pub_locations(pub_json_data):
    uber_threashold = 0.001 # assumes people will uber if > 0.111km to walk as crow flies (obviously should be changed)

    x_mean, y_mean = get_mean_of_pub_locations(pub_json_data)

    pub_location_data = [(pub[1], pub[2]) for pub in pub_json_data]

    pub_array = np.array(pub_location_data)

    clever_pubs = np.array([pub for pub in pub_array if 0.5 * uber_threashold < distance(pub[0], x_mean, pub[1], y_mean) < 1.75 * uber_threashold])

    print("c pubs")
    print(clever_pubs)
    x_clever_mean = np.mean(clever_pubs[:,0])
    y_clever_mean = np.mean(clever_pubs[:,1])

    return x_clever_mean, y_clever_mean

def find_closest_pubs(pubs, x_mean, y_mean, number_of_pubs=1):
    pub_indexes = []
    
    for i in range(number_of_pubs):
        closest_index = -1
        closest_distance = 10

        print("here")
        print(pubs)
        print(x_mean)
        print(y_mean)

        for j, pub in enumerate(pubs):
            distance_to_pub = distance(pub[1], x_mean, pub[2], y_mean)
            if(distance_to_pub < closest_distance):
                closest_distance = distance_to_pub
                closest_index = j
        pub_indexes.append(closest_index)

    print("indexes")
    print(pub_indexes)
    return [pub for i, pub in enumerate(pubs) if i in pub_indexes]
