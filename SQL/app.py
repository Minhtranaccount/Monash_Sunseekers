# Import dependancies
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

# Import Flask
from flask import (Flask, jsonify, render_template)
import sqlite3

app = Flask(__name__)

# Define a function to create a connection to the SQLite database
def get_db_connection():
    conn = sqlite3.connect('db.sqlite')
    conn.row_factory = sqlite3.Row
    return conn

# List all the available routes.
# The Welcome page
@app.route("/")
def welcome():
    return (
        f"Welcome to our Home Page!<br/>"
        f"Postcode Co-ordinates: <a href=\"/api/coordinates\">api/coordinates</a><br/>"
        f"Link back to HTML"
        f"<br/>"
      )

# The API Page
# Define a Flask route to retrieve data from the database
@app.route('/api/coordinates')
def get_coordinates():
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM APVI_coordinates')
        rows = cursor.fetchall()

        # Convert the results to a list of dictionaries
        results = []
        for row in rows:
            result = {}
            result['postcode'] = row['postcode']
            result['Latitude'] = row['Lat_precise']
            result['Longitude'] = row['Long_precise']
            result['Installations'] = row['instals']
            result['Est_Dwellings'] = row['estimated_dwellings']
            result['Density'] = row['density']
            result['Capacity'] = row['capacity']
            result['Capacity_under_10kw'] = row['capunder10']
            result['Capacity_10_to_100kw'] = row['cap10_100']
            result['Capacity_over_100kw'] = row['capover100']
            result['Count_under_10kw'] = row['countunder10']
            result['Count_10_to_100kw'] = row['count10_100']
            result['Count_over_100kw'] = row['countover100']
            result['Potential_kilowatts'] = row['pot_kw']
            result['Suburb'] = row['locality']
            result['State'] = row['state']
            result['Region'] = row['sa4name']
            results.append(result)

        # Close the connection
        conn.close()

        # Show the results
        return jsonify(results)

# The html page
@app.route("/html")
def html():
    return render_template("index.html")

# execute the code
if __name__ == '__main__':
    app.run(debug=True)