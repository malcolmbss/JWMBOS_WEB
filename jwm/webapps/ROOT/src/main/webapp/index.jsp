JWMBOS......
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%@ page import="java.util.*" %>
<%@ page import="jwm.interfaces.servlet.*" %>
<%@ page import="jwm.svcimpl.servlet.*" %>
<%@ page import="jwm.coreinterfaces.svcroot.*" %>
<%@ page import="jwm.coresvcimpl.svcroot.*" %>

<%
    try
    {
        out.print("JWM2");
        Svcs svcs = (Svcs) null;
        ServletSvc servletSvc = new BasicServletSvc( svcs );
        JWMServlet servlet = new RESTServlet();
    }
    catch( Exception e )
    {
        out.println(e.getMessage()); 
    }
%>