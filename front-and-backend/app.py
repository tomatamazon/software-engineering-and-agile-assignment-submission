from flask import Flask, request, send_from_directory, render_template
from sshtunnel import SSHTunnelForwarder
import pymysql
import open_pass, login, create_ticket, get_entries, update_entry, delete_entry

app = Flask(__name__, static_url_path='', static_folder='software-and-agile-frontend\\build')
ec2_dns = "ec2-3-10-24-85.eu-west-2.compute.amazonaws.com"
db_pass = open_pass.get_pass()

@app.errorhandler(404)
def not_found(e):
    return render_template("404.html")

@app.route("/", defaults={'path': ''})
def hello_world(path):
    return send_from_directory(app.static_folder, "index.html")

@app.route("/login", methods=["POST"])
def login_func():
    user_type = login.login(ec2_dns, db_pass)
    return user_type

@app.route("/post_data", methods=["POST"])
def create_ticket_func():
    create_ticket_status = create_ticket.create_ticket(ec2_dns, db_pass)
    return create_ticket_status

@app.route("/get_entries", methods=["POST"])
def get_database_entries_func():
    entries = get_entries.get_entries(ec2_dns, db_pass)
    return entries

@app.route("/update_entry", methods=["POST"])
def update_entries_func():
    update_entry_status = update_entry.update_entry(ec2_dns, db_pass)
    return update_entry_status

@app.route("/delete_entry", methods=["POST"])
def delete_entries_func():
    delete_entry_status = delete_entry.delete_entry(ec2_dns, db_pass)
    return delete_entry_status