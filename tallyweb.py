from flask import Flask
from flask import current_app, request, escape, jsonify, render_template, redirect, url_for
import sqlite3
import datetime
from db import db

app = Flask(__name__, static_url_path='/tallyweb/static')
app.config['DATABASE'] = 'tag1.db'
db.init_app(app)

@app.route('/tallyweb/')
def index():
    return render_template("index.html")

@app.route('/tallyweb/incoming')
def incoming_history():
    return render_template("incoming.html")

@app.route('/tallyweb/outgoing')
def outgoing_history():
    return render_template("outgoing.html")

def db_get_current():
    conn = db.get_db()
    cursor = conn.execute('SELECT COUNT(*) FROM incoming');
    numberOfIncoming = cursor.fetchone()[0]
    cursor = conn.execute('SELECT COUNT(*) FROM outgoing');
    numberOfOutgoing = cursor.fetchone()[0]
    return { 'incoming': numberOfIncoming, 'outgoing': numberOfOutgoing }

@app.route('/tallyweb/api/current', methods=['GET'])
def api_current():
    return jsonify(db_get_current())

@app.route('/tallyweb/api/incoming', methods=['PUT'])
def api_incoming_put():
    conn = db.get_db()
    conn.execute("INSERT INTO incoming (time) VALUES (strftime('%s','now'))")
    conn.commit()
    return jsonify(db_get_current())

@app.route('/tallyweb/api/incoming', methods=['GET'])
def api_incoming_get():
    conn = db.get_db()
    result = []
    for row in conn.execute("SELECT datetime(time,'unixepoch', 'localtime') FROM incoming"):
        result.append(row[0])
    return jsonify(result)

@app.route('/tallyweb/api/outgoing', methods=['PUT'])
def api_outgoing_put():
    conn = db.get_db()
    conn.execute("INSERT INTO outgoing (time) VALUES (strftime('%s','now'))")
    conn.commit()
    return jsonify(db_get_current())

@app.route('/tallyweb/api/outgoing', methods=['GET'])
def api_outgoing_get():
    conn = db.get_db()
    result = []
    for row in conn.execute("SELECT datetime(time,'unixepoch', 'localtime') FROM outgoing"):
        result.append(row[0])
    return jsonify(result)

