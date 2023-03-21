import os
from flask import Flask, jsonify, render_template
from sqlalchemy import create_engine, Column, Integer, String, Float, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Flask setup
app = Flask(__name__, static_folder='static')

# Set up SQLAlchemy
engine = create_engine('sqlite:///db.sqlite')
Base = declarative_base(bind=engine)
Session = sessionmaker(bind=engine)


# Define the SQLAlchemy model
class APVI_coordinates(Base):
    __tablename__ = 'APVI_coordinates'

    id = Column(Integer, primary_key=True)
    postcode = Column(String)
    Lat_precise = Column(Float)
    Long_precise = Column(Float)
    instals = Column(Integer)
    estimated_dwellings = Column(Integer)
    density = Column(Float)
    capacity = Column(Float)
    capunder10 = Column(Float)
    cap10_100 = Column(Float)
    capover100 = Column(Float)
    countunder10 = Column(Integer)
    count10_100 = Column(Integer)
    countover100 = Column(Integer)
    pot_kw = Column(Float)
    locality = Column(String)
    state = Column(String)
    sa4name = Column(String)

# The Welcome page
@app.route("/")
def home():
    return render_template("index.html")

# Define a Flask route to retrieve postcode from the database
@app.route('/api/postcode')
def get_coordinates():
    session = Session()
    rows = session.query(APVI_coordinates).all()

    # Convert the results to a list of dictionaries
    results = []
    for row in rows:
        result = {}
        result['postcode'] = row.postcode
        result['Latitude'] = row.Lat_precise
        result['Longitude'] = row.Long_precise
        result['Installations'] = row.instals
        result['Est_Dwellings'] = row.estimated_dwellings
        result['Density'] = row.density
        result['Capacity'] = row.capacity
        result['Capacity_under_10kw'] = row.capunder10
        result['Capacity_10_to_100kw'] = row.cap10_100
        result['Capacity_over_100kw'] = row.capover100
        result['Count_under_10kw'] = row.countunder10
        result['Count_10_to_100kw'] = row.count10_100
        result['Count_over_100kw'] = row.countover100
        result['Potential_kilowatts'] = row.pot_kw
        result['Suburb'] = row.locality
        result['State'] = row.state
        result['Region'] = row.sa4name
        results.append(result)

    # Close the session
    session.close()

    # Show the results
    return jsonify(results)

# Define a function to create a session to the SQLite database
def get_db_session():
    return Session()


# Define a Flask route to retrieve state data from the database
@app.route('/api/states')
def get_states():
    session = Session()

    # Group the results by state and sum the capacity and potential kilowatts
    state_results = session.query(
        APVI_coordinates.state,
        func.sum(APVI_coordinates.capacity).label('Capacity'),
        func.sum(APVI_coordinates.pot_kw).label('Potential_kilowatts'),
        func.sum(APVI_coordinates.capunder10).label('Capacity_under_10kw'),
        func.sum(APVI_coordinates.cap10_100).label('Capacity_10_to_100kw'),
        func.sum(APVI_coordinates.capover100).label('Capacity_over_100kw'),
        func.sum(APVI_coordinates.countunder10).label('Count_under_10kw'),
        func.sum(APVI_coordinates.count10_100).label('Count_10_to_100kw'),
        func.sum(APVI_coordinates.countover100).label('Count_over_100kw'),
        func.sum(APVI_coordinates.instals).label('Installations'),     
        func.sum(APVI_coordinates.estimated_dwellings).label('Est_Dwellings'),
        func.sum(APVI_coordinates.density).label('Density'),    
    ).group_by(APVI_coordinates.state).all()

    # Convert the results to a list of dictionaries
    state_results_list = []
    for row in state_results:
        result = {}
        result['State'] = row.state
        result['Capacity'] = row.Capacity
        result['Potential_kilowatts'] = row.Potential_kilowatts
        result['Capacity_under_10kw'] = row.Capacity_under_10kw
        result['Capacity_10_to_100kw'] = row.Capacity_10_to_100kw
        result['Capacity_over_100kw'] = row.Capacity_over_100kw
        result['Count_under_10kw'] = row.Count_under_10kw
        result['Count_10_to_100kw'] = row.Count_10_to_100kw
        result['Count_over_100kw'] = row.Count_over_100kw
        result['Installations'] = row.Installations
        result['Est_Dwellings'] = row.Est_Dwellings
        result['Density'] = row.Density
        state_results_list.append(result)

    # Close the session
    session.close()

    # Return the results as JSON
    return jsonify(state_results_list)

# Define a Flask route to retrieve region data from the database
@app.route('/api/regions')
def get_regions():
    session = Session()

    # Group the results by state and sum the capacity and potential kilowatts
    region_results = session.query(
        APVI_coordinates.state,
        APVI_coordinates.sa4name,
        func.sum(APVI_coordinates.capacity).label('Capacity'),
        func.sum(APVI_coordinates.pot_kw).label('Potential_kilowatts'),
        func.sum(APVI_coordinates.capunder10).label('Capacity_under_10kw'),
        func.sum(APVI_coordinates.cap10_100).label('Capacity_10_to_100kw'),
        func.sum(APVI_coordinates.capover100).label('Capacity_over_100kw'),
        func.sum(APVI_coordinates.countunder10).label('Count_under_10kw'),
        func.sum(APVI_coordinates.count10_100).label('Count_10_to_100kw'),
        func.sum(APVI_coordinates.countover100).label('Count_over_100kw'),
        func.sum(APVI_coordinates.instals).label('Installations'),     
        func.sum(APVI_coordinates.estimated_dwellings).label('Est_Dwellings'),
        func.sum(APVI_coordinates.density).label('Density'),    
    ).group_by(APVI_coordinates.sa4name).all()

# Convert the results to a list of dictionaries
    region_results_list = []
    for row in region_results:
        result = {}
        result['Region'] = row.sa4name
        result['State'] = row.state
        result['Capacity'] = row.Capacity
        result['Potential_kilowatts'] = row.Potential_kilowatts
        result['Capacity_under_10kw'] = row.Capacity_under_10kw
        result['Capacity_10_to_100kw'] = row.Capacity_10_to_100kw
        result['Capacity_over_100kw'] = row.Capacity_over_100kw
        result['Count_under_10kw'] = row.Count_under_10kw
        result['Count_10_to_100kw'] = row.Count_10_to_100kw
        result['Count_over_100kw'] = row.Count_over_100kw
        result['Installations'] = row.Installations
        result['Est_Dwellings'] = row.Est_Dwellings
        result['Density'] = row.Density
        region_results_list.append(result)

# Close the session
    session.close()

# Return the results as JSON
    return jsonify(region_results_list)


# The maps page
@app.route("/maps")
def maps():
    return render_template("maps.html")

# The charts page
@app.route("/charts")
def charts():
    return render_template("chart.html")

# The khin test page
@app.route("/khin")
def khin():
    return render_template("khin.html")

# The reinier test page
@app.route("/reinier")
def reinier():
    return render_template("reinier.html")

# list the weblinks for each of the above
@app.route("/apilinks")
def links():
    return (
        f"Welcome to the Monash Sunseekers Home Page!<br/>"
        f"Postcode data: <a href=\"/api/postcode\">api/postcode</a><br/>"
        f"State data: <a href=\"/api/states\">api/states</a><br/>"
        f"Region data: <a href=\"/api/regions\">api/regions</a><br/>"
        f"Link to maps page: <a href=\"/maps\">maps</a><br/>"
        f"Link to charts page: <a href=\"/charts\">charts</a><br/>"
        f"Link to charts page: <a href=\"/khin\">khin</a><br/>"
        f"Link to charts page: <a href=\"/reinier\">reinier</a><br/>"
        f"<br/>"
    )

# execute the code
if __name__ == '__main__':
    app.run(debug=True)