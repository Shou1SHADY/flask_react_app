from flask import Flask, jsonify, request, abort
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, jwt_required, create_access_token
from wtforms import Form, StringField, validators

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///data.db"
db = SQLAlchemy(app)
migrate = Migrate(app, db)
app.config['JWT_SECRET_KEY'] = 'super-secret'  # secret_key
jwt = JWTManager(app)


class ExistingValueForm(Form):
    value = StringField('Value', [validators.Length(min=1, max=80)])

@app.route("/existing-values", methods=["POST"])
def create_existing_value():
    form = ExistingValueForm(request.form)
    if form.validate():
        new_value = ExistingValue(value=form.value.data)
        db.session.add(new_value)
        db.session.commit()
        return jsonify({"message": "Value added successfully"}), 201
    else:
        return jsonify({"errors": form.errors}), 400

class ExistingValue(db.Model):
    
    id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.Integer, nullable=False)




@app.route("/login", methods=["POST"])
def login():
    username = request.json.get("username")
    password = request.json.get("password")
    if username == "admin" and password == "password":
        access_token = create_access_token(identity=username)
        return jsonify(success=True,access_token=access_token), 200
    else:
        return jsonify(success=False, msg="Bad username or password"), 401


# 
@app.route("/existing-values", methods=["GET"])
@jwt_required()
def get_existing_values():
    try:
        values = ExistingValue.query.all()
        return jsonify([{"id": v.id, "value": v.value} for v in values])
    except Exception as e:
        abort(500, str(e))


@app.route("/existing-values/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_existing_value(id):
    try:
        # Fetch the record by ID
        value = ExistingValue.query.get(id)
        if value is None:
            return jsonify({"error": "Value not found"}), 404
        
        # Delete the value from the database
        db.session.delete(value)
        db.session.commit()
        
        return jsonify({"message": "Value deleted successfully"}), 200
    except Exception as e:
        # Handle any errors that occur
        return jsonify({"error": str(e)}), 500        

        


def init_db():
    with app.app_context():
        db.create_all()
        if ExistingValue.query.count() == 0:
            existing_value = ExistingValue(value="Initial Value")
            db.session.add(existing_value)
            db.session.commit()

if __name__ == "__main__":
    init_db()
    app.run(debug=True)
