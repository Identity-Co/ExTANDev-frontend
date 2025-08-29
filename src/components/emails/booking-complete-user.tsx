import React from "react";

const BookingEmail = ({
  firstName,
  lastName,
  email,
  phoneNumber,
  location1,
  location2,
  numberOfPeople,
  choiceOfActivity,
  eventTitle,
  bookingDate,
  timeslots,
  bookingFee,
  depositAmount,
  secondPayment,
  totalAmount
}) => {
  return (
    <table width="100%" style={{ backgroundColor: "#F0F0F0" }}>
      <tbody>
        <tr>
          <td></td>
          <td width="600" style={{ padding: "70px 0" }}>
            <table width="100%" style={{ backgroundColor: "#fff", borderRadius: "0px" }}>
              <tbody>
                {/* Header */}
                <tr>
                  <td>
                    <table
                      width="100%"
                      style={{
                        backgroundColor: "#014040",
                        color: "#fff",
                        fontWeight: "bold",
                        lineHeight: "100%",
                        fontFamily: "Helvetica Neue,Helvetica,Roboto,Arial,sans-serif",
                        borderRadius: "0px",
                      }}
                    >
                      <tbody>
                        <tr>
                          <td align="center" style={{ padding: "20px 0", display: "block" }}>
                            <img src="/images/front-pages/head-logo-mail.png" width="200" alt="" />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>

                {/* Body */}
                <tr>
                  <td style={{ padding: "48px", color: "#1F1F1F", fontFamily: "Helvetica Neue,Helvetica,Roboto,Arial,sans-serif", fontSize: "13px", lineHeight: "150%", textAlign: "left" }}>
                    <div>
                      <p>Hi {firstName},</p>
                      <p>Thank you for completing payment for your booking, your booking is now confirmed!</p>
                      <p>Please see a summary of your booking below:</p>

                      <table width="100%">
                        <tbody>
                          <tr>
                            <td style={{ paddingRight: "15px" }}>
                              <table width="100%">
                                <tbody>
                                  <tr>
                                    <td style={{color: "#1F1F1F", fontFamily: "Helvetica Neue,Helvetica,Roboto,Arial,sans-serif", fontSize: "13px", lineHeight: "150%", padding: "0 0 10px"}}><strong>Full Name:</strong><br />{firstName} {lastName}</td>
                                  </tr>
                                  <tr>
                                    <td style={{color: "#1F1F1F", fontFamily: "Helvetica Neue,Helvetica,Roboto,Arial,sans-serif", fontSize: "13px", lineHeight: "150%", padding: "0 0 10px"}}><strong>Email:</strong><br />{email}</td>
                                  </tr>
                                  <tr>
                                    <td style={{color: "#1F1F1F", fontFamily: "Helvetica Neue,Helvetica,Roboto,Arial,sans-serif", fontSize: "13px", lineHeight: "150%", padding: "0 0 10px"}}><strong>Phone Number:</strong><br />{phoneNumber}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                            <td style={{ paddingLeft: "15px" }}>
                              <table width="100%">
                                <tbody>
                                  <tr>
                                    <td style={{color: "#1F1F1F", fontFamily: "Helvetica Neue,Helvetica,Roboto,Arial,sans-serif", fontSize: "13px", lineHeight: "150%", padding: "0 0 10px"}}><strong>Location:</strong><br />{location1} {location2}</td>
                                  </tr>
                                  <tr>
                                    <td style={{color: "#1F1F1F", fontFamily: "Helvetica Neue,Helvetica,Roboto,Arial,sans-serif", fontSize: "13px", lineHeight: "150%", padding: "0 0 10px"}}><strong>Number of People:</strong><br />{numberOfPeople}</td>
                                  </tr>
                                  <tr>
                                    <td style={{color: "#1F1F1F", fontFamily: "Helvetica Neue,Helvetica,Roboto,Arial,sans-serif", fontSize: "13px", lineHeight: "150%", padding: "0 0 10px"}}><strong>Choice of Activity:</strong><br />{choiceOfActivity}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      {/* Booking Table */}
                      <table width="100%" border="1" cellPadding="10" style={{ color: "#1F1F1F", fontFamily: "Helvetica Neue,Helvetica,Roboto,Arial,sans-serif", fontSize: "13px", lineHeight: "150%", textAlign: "left", borderColor: "#d1d1d1" }}>
                        <thead>
                          <tr>
                            <th>Event Title:</th>
                            <th>Booking Date:</th>
                            <th>Timeslots:</th>
                            <th>Booking fee:</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{eventTitle}</td>
                            <td>{bookingDate}</td>
                            <td>{timeslots}</td>
                            <td>{bookingFee}</td>
                          </tr>
                          <tr>
                            <td colSpan="3">Deposit Amount:</td>
                            <td>{depositAmount}</td>
                          </tr>
                          <tr>
                            <td colSpan="3">Second Payment:</td>
                            <td>{secondPayment}</td>
                          </tr>
                          <tr>
                            <td colSpan="3" align="right" style={{ fontSize: "15px" }}><strong>Total Amount:</strong></td>
                            <td style={{ fontSize: "15px" }}><strong>{totalAmount}</strong></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>

                {/* Footer */}
                <tr>
                  <td>
                    <table width="100%" style={{ backgroundColor: "#014040", borderRadius: "0px", color: "#fff" }}>
                      <tbody>
                        <tr>
                          <td align="center" style={{ padding: "30px 0 16px", fontSize: "12px", lineHeight: "150%", fontFamily: "Helvetica Neue,Helvetica,Roboto,Arial,sans-serif", color: "#FFF" }}>
                            <p style={{margin: "0", padding: "0" }}>
                              <a href="tel:1234567890" style={{ color: "#fff", textDecoration: "none" }}>1234567890</a><br />
                              <a href="mailto:hello@adventurenetwork.com" style={{ color: "#fff", textDecoration: "none" }}>hello@adventurenetwork.com</a><br />
                              <a href="https://www.adventurenetwork.com" style={{ color: "#fff", textDecoration: "none" }}>adventurenetwork.com</a><br />
                              2/54 Hulme Court, Myaree Perth WA 3695
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td vlign="middle" align="center" style={{ padding: "0" }}>
                            <a href="#" style={{color: "#dd6c53", fontWeight: "normal", textDecoration: "underline"}}><img src="/images/front-pages/insta.png" alt="Instagram" style={{ border: "none", display: "inline-block", fontSize: "14px", fontWeight: "bold", height: "auto", outline: "none", textDecoration: "none", textTransform: "capitalize", verticalAlign: "middle", marginRight: "10px", maxWidth: "100%" }} /></a>
                            <a href="#" style={{color: "#dd6c53", fontWeight: "normal", textDecoration: "underline"}}><img src="/images/front-pages/fb.png" alt="Facebook" style={{ border: "none", display: "inline-block", fontSize: "14px", fontWeight: "bold", height: "auto", outline: "none", textDecoration: "none", textTransform: "capitalize", verticalAlign: "middle", marginRight: "10px", maxWidth: "100%" }} /></a>
                            <a href="#" style={{color: "#dd6c53", fontWeight: "normal", textDecoration: "underline"}}><img src="/images/front-pages/yt.png" alt="YouTube" style={{ border: "none", display: "inline-block", fontSize: "14px", fontWeight: "bold", height: "auto", outline: "none", textDecoration: "none", textTransform: "capitalize", verticalAlign: "middle", marginRight: "10px", maxWidth: "100%" }} /></a>
                            <a href="#" style={{color: "#dd6c53", fontWeight: "normal", textDecoration: "underline"}}><img src="/images/front-pages/x.png" alt="X" style={{ border: "none", display: "inline-block", fontSize: "14px", fontWeight: "bold", height: "auto", outline: "none", textDecoration: "none", textTransform: "capitalize", verticalAlign: "middle", marginRight: "10px", maxWidth: "100%" }} /></a>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style={{ color: "#fff", padding: "16px 0 30px 0", fontFamily: "Helvetica Neue,Helvetica,Roboto,Arial,sans-serif", fontSize: "10px", lineHeight: "150%" }}>© 2025 | All rights reserved</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>

              </tbody>
            </table>
          </td>
          <td></td>
        </tr>
      </tbody>
    </table>
  );
};

export default BookingEmail;