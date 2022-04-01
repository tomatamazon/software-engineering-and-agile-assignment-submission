from flask import jsonify, make_response
from app import request, SSHTunnelForwarder, pymysql

def create_ticket(ec2_dns, db_pass):
    title = request.json["title"]
    description = request.json["description"]
    assignee = request.json["assignee"]
    progress_estimate = int(request.json["progress_estimate"]) - 1

    post_create_ticket_query = "INSERT INTO database1.ticket_info (Title, Description, Assignee, ProgressEstimate, ProgressActual, Resolved) VALUES (%(title)s, %(description)s, %(assignee)s, %(progress_estimate)s, %(progress_actual)s, %(resolved)s);"
    parameters = {'title': title, 'description': description, 'assignee': assignee, 'progress_estimate': progress_estimate, 'progress_actual': 0, 'resolved': False}

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
                response = cur.execute(post_create_ticket_query, parameters)
                conn.commit()
                if response == 1:
                    create_ticket_status = "success"
                else:
                    create_ticket_status = "invalid"

        finally:
            conn.close()
            tunnel.close()

    create_ticket_status_response = make_response(jsonify({"status": create_ticket_status}))
    create_ticket_status_response.headers["Content-Type"] = "application/json"
    return create_ticket_status_response
