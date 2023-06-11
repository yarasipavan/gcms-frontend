import React, { memo } from "react";

import Table from "react-bootstrap/Table";

import Accordion from "react-bootstrap/Accordion";

function AllFlats({ flats }) {
  return (
    <div>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <h4>All flats</h4>
          </Accordion.Header>
          <Accordion.Body>
            {flats?.length === 0 ? (
              <p>No flats</p>
            ) : (
              <>
                <Table responsive="lg" striped hover className="text-center">
                  <thead style={{ fontSize: "0.9rem" }}>
                    <tr>
                      <th>Block</th>
                      <th>Flat Number</th>
                      <th>Owner - Id</th>
                      <th>Occupant -Id</th>
                      <th>Ownership</th>
                      <th>Flat Status</th>
                    </tr>
                  </thead>
                  <tbody style={{ fontSize: "0.9rem" }}>
                    {flats?.map((flat, index) => (
                      <tr key={index}>
                        <td>{flat.block}</td>
                        <td>{flat.flat_number}</td>
                        <td>
                          {flat.Owner.name} - {flat.owner_id}
                        </td>
                        <td>
                          {flat.occupant_id ? (
                            <>
                              {flat.Occupant.occupant_name} -{" "}
                              {flat.Occupant.occupant_id}
                            </>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td>{flat.ownership ? flat.ownership : "-"}</td>
                        <td>
                          {flat.flat_status ? (
                            "occupied"
                          ) : (
                            <span className="text-danger">Ready to occupy</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            )}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

export default AllFlats;
