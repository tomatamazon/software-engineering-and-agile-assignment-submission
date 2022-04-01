from flask import jsonify, make_response
from app import request, SSHTunnelForwarder, pymysql

def get_entries(ec2_dns, db_pass):
    get_database_entries_query = "SELECT * FROM database1.ticket_info;"

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
                # If there are no entries in the database, a 0 will be returned.
                # If the database is not empty, the number returned will be the amount of entries in the database.
                response = cur.execute(get_database_entries_query)

                if response == 0:
                    response_data = "0"
                elif response > 0:
                    count = 0
                    response_data = {}
                    for row in cur:
                        count += 1
                        response_data["response{0}".format(count)] = {"id": row[0], "title": row[1], "description": row[2], "assignee": row[3], "progress_estimate": row[4], "progress_actual": row[5], "resolved": row[6]}
                else:
                    response_data = "0"

        finally:
            conn.close()
            tunnel.close()

    create_data_response = make_response(jsonify({"data": response_data}))
    create_data_response.headers["Content-Type"] = "application/json"
    return create_data_response