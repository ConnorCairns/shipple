import flask
import requests
from flask import request, jsonify

app = flask.Flask(__name__)
app.config["DEBUG"] = True

QUERY = """http://www.overpass-api.de/api/interpreter?data=
[out:json][timeout:25];
(
  node["amenity"="pub"]    ({0});
  way["amenity"="pub"]     ({0});
  relation["amenity"="pub"]({0});
  node["amenity"="bar"]    ({0});
  way["amenity"="bar"]     ({0});
  relation["amenity"="bar"]({0});
);
out body;
>;
out skel qt;"""


def parse_pubs(data):
    # print(f"A - {data}")
    query_parameters = data

    # print((query_parameters["elements"][0]["tags"]["name"]))
    nodes = {}
    ways = {}
    lst = []
    for pub in (query_parameters["elements"]):
        if pub["type"] == "node":
            lat = pub["lat"]
            long = pub["lon"]
            if "tags" in pub.keys():
                name = pub["tags"]["name"]
                lst.append([lat,long,name])
                # print(f"{lat} - {long} - {name}")
            else:
                nodes[pub["id"]] = [lat, long]
        else:
            name = pub["tags"]["name"]
            ways[pub["nodes"][0]] = name

    for id, name in ways.items():
        lat, long = nodes[id]
        lst.append([name, lat, long])

    # print(lst)

    for pub in lst:
        print(f"{pub[1]} - {pub[2]} - {pub[0]}")

    return jsonify(lst)


@app.route('/api/v1/get_pubs_box', methods=['GET'])
def get_pubs_box():
    query_parameters = request.get_json()
    # print(f"a {query_parameters}")
    lat1, lon1, lat2, lon2 = query_parameters["coords"]
    # print(f"b {lat1} - {lon1} - {lat2} - {lon2}")
    url = QUERY.format(f"{lat1},{lon1},{lat2},{lon2}")

    # print(f"c - {url}")
    r = requests.get(url)
    # print(f"d - {r}")
    data = r.json()
    # print(f"c - {data}")

    lst = parse_pubs(data)

    return lst
    # return "ree"

@app.route('/api/v1/get_pubs_poly', methods=['GET'])
def get_pubs_poly():
    query_parameters = request.get_json()
    lat1, lon1, lat2, lon2, lat3, lon3 = query_parameters["coords"]
    url = QUERY.format(f"{lat1},{lon1},{lat2},{lon2},{lat3},{lon3}")
    r = requests.get(url)
    data = r.json()

    lst = parse_pubs(data)

    return lst
    pass


app.run()