from flask import jsonify, make_response
from app import request, SSHTunnelForwarder, pymysql

def update_entry(ec2_dns, db_pass):
    entry_id = request.json["id"]
    title = request.json["title"]
    description = request.json["description"]
    assignee = request.json["assignee"]
    progress_actual = request.json["progress_actual"]
    resolved = request.json["resolved"]

    if progress_actual == "" or progress_actual == 0:
        progress_actual = 0
    else:
        progress_actual = int(request.json["progress_actual"]) - 1

    if resolved is True:
        resolved = 1
    else:
        resolved = 0

    update_entry_query = "UPDATE database1.ticket_info SET "

    if title != "":
        update_entry_query += "Title = '" + title + "'"

    if title == "" and description != "":
        update_entry_query += "Description = '" + description + "'"

    if title != "" and description != "":
        update_entry_query += ", Description = '" + description + "'"

    if title == "" and description == "" and assignee != "":
        update_entry_query += "Assignee = '" + assignee + "'"

    if (title != "" or description != "") and assignee != "":
        update_entry_query += ", Assignee = '" + assignee + "'"

    if title == "" and description == "" and assignee == "" and progress_actual != 0:
        update_entry_query += "ProgressActual = " + str(progress_actual)

    if (title != "" or description != "" or assignee != "") and progress_actual != 0:
        update_entry_query += ", ProgressActual = " + str(progress_actual)

    if title == "" and description == "" and assignee == "" and progress_actual == 0:
        update_entry_query += "Resolved = " + str(resolved)

    if title != "" or description != "" or assignee != "" or progress_actual != 0:
        update_entry_query += ", Resolved = " + str(resolved)

    update_entry_query += " WHERE ID = " + str(entry_id)

    with SSHTunnelForwarder(
            ec2_dns,
            ssh_username="ec2-user",
            ssh_pkey="project-db-keys.pem",
            remote_bind_address=("apprenticeship-project-database-1.ccmjfntxpuqd.eu-west-2.rds.amazonaws.com", 3306)
    ) as tunnel:
        tunnel.start()

        conn = pymysql.connect(
            user="admin",
            password=db_pass,
            host="localhost",
            port=tunnel.local_bind_port
        )

        try:
            with conn.cursor() as cur:
                # If the query is successful, a 1 will be returned.
                # If the query is unsuccessful, a 0 will be returned.
                response = cur.execute(update_entry_query)
                conn.commit()
                if response == 1:
                    entry_update_status = "success"
                else:
                    entry_update_status = "failure"

        finally:
            conn.close()
            tunnel.close()

    entry_update_status_return = make_response(jsonify({"entry_update_status": entry_update_status}))
    entry_update_status_return.headers["Content-Type"] = "application/json"
    return entry_update_status_return
