from flask import Flask, request, jsonify
from flask_restful import Resource, Api, reqparse

# Julia preload libraries
from julia import Main
Main.include('covid19_simulator/MMCAcovid19.jl')
julia_func = Main.include("covid19_simulator/main.jl")

app = Flask(__name__)
api = Api(app)


class Simulation(Resource):
    def post(self):
        json_data = request.get_json(force=True)
        json_simulation = julia_func(json_data)

        return jsonify(json_simulation)

api.add_resource(Simulation, '/simulation')


if __name__ == '__main__':
    app.run()  # run our Flask app

