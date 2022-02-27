import flask
import requests
from flask import request, jsonify

# import pathFinder
from pathFinder import methods, algorithms_methods
app = flask.Flask(__name__)
app.config["DEBUG"] = True

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

def func(coords):
    return coords

def func2(pubs):
    return pubs

@app.route('/api/v1/get_pubs_box', methods=['GET'])
def api_get_pubs_box():
    query_parameters = request.get_json()

    lat1, lon1, lat2, lon2 = query_parameters["coords"]

    lst = algorithms_methods.get_pubs_in_box(lat1,lon1,lat2,lon2)

    return jsonify(lst)


@app.route('/api/v1/get_pubs_poly', methods=['GET'])
def api_get_pubs_poly():
    query_parameters = request.get_json()
    # print(f"a {query_parameters}")
    coords = query_parameters["coords"]
    # print(f"b {coords}")
    tmp = " ".join([str(i) for i in coords])
    url = QUERY.format(f'poly: "{tmp}"')
    # print(f"c - {url}")
    r = requests.get(url)
    # print(f"d - {r}")
    data = r.json()
    # print(f"e - {data}")

    lst = methods.parse_pubs(data)

    return jsonify(lst)
    # return "ree"
    pass

def get_pubs_poly(coords):
    # print(f"b {coords}")
    tmp = " ".join([str(i) for i in coords])
    url = QUERY.format(f'poly: "{tmp}"')
    # print(f"c - {url}")
    r = requests.get(url)
    # print(f"d - {r}")
    data = r.json()
    # print(f"e - {data}")

    lst = methods.parse_pubs(data)

    return lst
    # return "ree"
    pass

@app.route('/api/v1/chuckle_brothers', methods=['POST'])
def chuckle_brothers():
    print("A")
    query_parameters = request.get_json()
    coordLst = []
    for i in range(0, len(query_parameters["coords"]), 2):
        coordLst.append((query_parameters["coords"][i], query_parameters["coords"][i+1]))

    print(coordLst)
    print("B")
    poly = func(methods.get_poly(coordLst))
    # poly = func(query_parameters["coords"])
    print("C")
    pubs = get_pubs_poly(poly)
    sPubs = None
    # sPubs = func2(pubs)
    print("D")
    ans = {"coords" : poly, "pubs" : pubs, "selected" : sPubs}
    print("ans" , ans)
    return jsonify(ans)

@app.route('/api/v1/basic_mean', methods=['GET'])
def basic_mean():
    query_parameters = request.get_json()
    lat1, lon1, lat2, lon2 = query_parameters["coords"]

    pubs_data = algorithms_methods.get_pubs_in_box(lat1,lon1,lat2,lon2)

    print("data here")
    print(pubs_data)
    x_mean, y_mean = algorithms_methods.get_mean_of_pub_locations(pubs_data)

    closest_pubs_array = algorithms_methods.find_closest_pubs(pubs_data, x_mean, y_mean, number_of_pubs=1)

    return jsonify(closest_pubs_array)

@app.route('/api/v1/clever_mean', methods=['GET'])
def clever_mean():
    query_parameters = request.get_json()
    lat1, lon1, lat2, lon2 = query_parameters["coords"]

    pubs_data = algorithms_methods.get_pubs_in_box(lat1,lon1,lat2,lon2)

    x_clever_mean, y_clever_mean = algorithms_methods.get_clever_mean_of_pub_locations(pubs_data)

    closest_pubs_array = algorithms_methods.find_closest_pubs(pubs_data, x_clever_mean, y_clever_mean, number_of_pubs=1)

    return jsonify(closest_pubs_array)


if __name__ == "__main__":
    app.run(host="0.0.0.0")