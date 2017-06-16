/* Copyright 2014 Pascal Christoph, hbz and others. Licensed under the Eclipse Public License 1.0 */

package controllers;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.stream.Collectors;

import models.Index;
import play.Play;
import play.api.libs.json.Json;
import play.mvc.Controller;
import play.mvc.Result;

/**
 * Dataset controller. Implements path-style routes and `about` redirects.
 * 
 * @author Pascal Christoph (dr0i), Fabian Steeg (fsteeg)
 */
public final class LobidTeam extends Controller {

	private LobidTeam() {
		/* No instantiation */
	}

	/**
	 * @return The team page.
	 */
	public static Result team() {
		return ok(views.html.team.render(Json.parse(readFile("team"))));
	}

	/**
	 * Returns {@link #personAbout(String, String)}
	 */
	@SuppressWarnings("javadoc")
	public static Result get(final String id) {
		return ok(views.html.profile.render(id, Json.parse(readFile(id))));
	}

	/**
	 * Returns {@link #personAbout(String, String)}
	 */
	@SuppressWarnings("javadoc")
	public static Result getDotFormat(final String id, final String format) {
		return format.equals("html")
				? ok(views.html.profile.render(id, Json.parse(readFile(id))))
				: staticJsonld(id);
	}

	private static Result staticJsonld(String name) {
		response().setContentType("application/json");
		response().setHeader("Access-Control-Allow-Origin", "*");
		return ok(readFile(name));
	}

	private static String readFile(String name) {
		return new BufferedReader(new InputStreamReader(
				Play.application().resourceAsStream("/team/" + name + ".json"))).lines()
						.collect(Collectors.joining("\n"));
	}

	/**
	 * Redirects to {@link #apAbout(String, String)}
	 */
	@SuppressWarnings("javadoc")
	public static Result ap(final String format) {
		return redirect(routes.LobidTeam.apAbout(format));
	}

	/**
	 * Returns {@link #personAbout(String, String)}
	 */
	@SuppressWarnings("javadoc")
	public static Result apAbout(final String id, final String format) {
		return Collection.getId(id, format, Index.LOBID_TEAM);
	}

	/**
	 * Redirects to {@link #fsAboutString, String)}
	 */
	@SuppressWarnings("javadoc")
	public static Result fs(final String format) {
		return redirect(routes.LobidTeam.fsAbout(format));
	}

	/**
	 * Returns {@link #personAbout(String, String)}
	 */
	@SuppressWarnings("javadoc")
	public static Result fsAbout(final String id, final String format) {
		return Collection.getId(id, format, Index.LOBID_TEAM);
	}

	/**
	 * Redirects to {@link #pcAbout(String, String)}
	 */
	@SuppressWarnings("javadoc")
	public static Result pc(final String format) {
		return redirect(routes.LobidTeam.pcAbout(format));
	}

	/**
	 * Returns {@link #personAbout(String, String)}
	 */
	@SuppressWarnings("javadoc")
	public static Result pcAbout(final String id, final String format) {
		return Collection.getId(id, format, Index.LOBID_TEAM);
	}
}