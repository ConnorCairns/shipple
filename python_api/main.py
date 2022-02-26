import flask

from flask import request, jsonify

app = flask.Flask(__name__)
app.config["DEBUG"] = True

# Create some test data for our catalog in the form of a list of dictionaries.


@app.route('/', methods=['GET'])
def home():
    return '''<h1>Distant Reading Archive</h1>
<p>A prototype API for distant reading of science fiction novels.</p>'''


# A route to return all of the available entries in our catalog.
@app.route('/api/v1/resources/books/all', methods=['GET'])
def api_all():
    # return jsonify(books)
    return None


@app.route('/api/v1/poggers', methods=['GET'])
def ree():
    query_parameters = request.get_json()
    print(query_parameters)
    return "ree"
    # query_parameters = request.args


@app.route('/api/v1/test', methods=['GET'])
def test():
    query_parameters = request.get_json()

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

    for pub in lst:
        print(f"{pub[1]} - {pub[2]} - {pub[0]}")

    return "test"
    # query_parameters = request.args




app.run()