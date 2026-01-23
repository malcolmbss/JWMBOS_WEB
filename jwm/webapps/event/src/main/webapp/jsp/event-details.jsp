<%@ page contentType="text/html;charset=UTF-8" %>
    <%@ taglib uri="jakarta.tags.core" prefix="c" %>
      <%@ page import="jwm.svcimpl.jsp.URLParamtersToEL" %>
    <% URLParamtersToEL.bindParamsToRequest(request); %>
        <!DOCTYPE html>
        <html>

        <head>
            <link rel="stylesheet" href="${pageContext.request.contextPath}/css/event-details-placeholder.css">
        </head>

        <body>


            <c:choose>

                    <c:when test="${id eq 'f63a3bdf-bad3-4a93-8fab-48389ffbc4db'}">
                    <div style="vertical-align: top;">
                        <div style="margin:0px 0 20px 0; width:100%; text-align:center">
                            <h2 style="padding:5px;background-color:#1380c1; color:white">
                                November 20, 2025 6:30-8:00pm Event<br>LifeMen Monthly BBQ</h2>
                            <h3>Brendan Steinhauser - The Alliance for Secure AI</h3>
                        </div>
                        <button style="background-color:#1380c1; color:white;">
                            Edit Event Details
                        </button> <span style="font-size:10pt"><i>(this button will appear based on user
                                roles)</i></span>
                        <h4>Summary</h4>
                        In this talk, Brendan Steinhauser, the Executive Director of The Alliance for Secure AI,
                        discusses
                        the
                        importance of responsible AI development and the potential risks associated with unchecked
                        advancements in...
                        <h4>Video</h4>
                        <div style="text-align:center; margin:0px 0 20px 0;">

                            <iframe style="margin-top:10px"
                                src="https://www.youtube.com/embed/YN4MDKMndtY?si=Fc6AhGSioPgI5cOJ"
                                title="LifeMen BBQ Nov 2025" allowfullscreen>
                            </iframe>

                        </div>

                        <h4>Transcript</h4>
                        Thanks for having me. Oh, it's our pleasure. I was hoping you wouldn't try to intimidate me that
                        shirt, but
                        that's alright. I'm a very intimidating guy....
                        <h4>Photos</h4>
                        <button style="background-color:#1380c1; color:white;">
                            Photo Gallery
                        </button>
                        <h4>Audio</h4>
                        ....
                        <h4>Testimonies</h4>
                        ....
                    </div>
                </c:when>
                <c:otherwise>
                    <div>
                        <h3>No event selected</h3>
                        <p>Select an event from the calendar to view details here.</p>
                    </div>
                </c:otherwise>
            </c:choose>

        </body>

        </html>