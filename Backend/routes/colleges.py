# Backend/routes/colleges.py

from flask import Blueprint, request, jsonify
from services.connectDB import connect_db
from bson import ObjectId

college_routes = Blueprint("college_routes", __name__)


def serialize_college(doc):
    doc["_id"] = str(doc["_id"])
    # Ensure interest is always present
    doc["interest"] = int(doc.get("interest", 0))
    return doc


# -----------------------------------
# GET /api/colleges  -> list colleges
# -----------------------------------
@college_routes.route("/colleges", methods=["GET"])
def get_colleges():
    db = connect_db()
    colleges_cursor = db.College.find()

    colleges = [serialize_college(c) for c in colleges_cursor]

    # total interest to help frontend compute %
    total_interest = sum(c["interest"] for c in colleges)

    return jsonify({
        "success": True,
        "data": colleges,
        "totalInterest": total_interest,
        "total": len(colleges)
    }), 200


# -----------------------------------
# POST /api/colleges -> add new college (optional)
# -----------------------------------
@college_routes.route("/colleges", methods=["POST"])
def add_college():
    db = connect_db()
    data = request.json or {}

    # default interest = 0
    data.setdefault("interest", 0)

    result = db.College.insert_one(data)

    return jsonify({
        "success": True,
        "message": "College added successfully",
        "id": str(result.inserted_id)
    }), 201


# -------------------------------------------------
# POST /api/colleges/interest-batch
# body: { "interest": { "<collegeId>": increment, ... } }
# -------------------------------------------------
@college_routes.route("/colleges/interest-batch", methods=["POST"])
def interest_batch():
    db = connect_db()
    payload = request.get_json(force=True, silent=True) or {}
    interest_map = payload.get("interest", {})

    if not isinstance(interest_map, dict) or not interest_map:
        resp = jsonify({"success": False, "message": "No interest data"})
        resp.headers["Access-Control-Allow-Origin"] = "*"
        return resp, 400

    updated_ids = []

    for college_id, inc in interest_map.items():
        try:
            inc = int(inc)
            if inc <= 0:
                continue

            try:
                oid = ObjectId(college_id)
                filter_query = {"_id": oid}
            except:
                filter_query = {"_id": college_id}

            db.College.update_one(filter_query, {"$inc": {"interest": inc}})
            updated_ids.append(college_id)

        except Exception as e:
            print("Interest error:", e)
            continue

    resp = jsonify({"success": True, "updated": updated_ids})
    resp.headers["Access-Control-Allow-Origin"] = "*"
    return resp, 200

