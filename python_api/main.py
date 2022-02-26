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
  node["amenity"="bar"]    ({0});
  way["amenity"="bar"]     ({0});
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
        print(pub)
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

    return jsonify(lst)


@app.route('/api/v1/get_pubs_box', methods=['GET'])
def get_pubs_box():
    query_parameters = request.get_json()
    # print(f"a {query_parameters}")
    lat1, lon1, lat2, lon2 = query_parameters["coords"]
    # print(f"b {lat1} - {lon1} - {lat2} - {lon2}")
    url = QUERY.format(f'{lat1},{lon1},{lat2},{lon2}')

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

    lst = parse_pubs(data)

    return lst
    # return "ree"
    pass


app.run()