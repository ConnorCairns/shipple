FROM python:3.10-buster

RUN apt update && apt install -y libspatialindex-dev python3-rtree
RUN pip3 install scipy numpy geopandas networkx osmnx shapely rtree fiona pyproj

COPY ./requirements.txt /app/requirements.txt
WORKDIR /app
RUN pip install -r requirements.txt
COPY . /app/
RUN pip install gunicorn[gevent]

CMD python3 main.py