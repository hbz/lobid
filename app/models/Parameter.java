/* Copyright 2013 Fabian Steeg, hbz. Licensed under the Eclipse Public License 1.0 */

package models;

import java.util.HashMap;
import java.util.Map;

import com.google.common.collect.ImmutableMap;

/**
 * Parameters for API requests.
 * 
 * @author Fabian Steeg (fsteeg)
 */
@SuppressWarnings("javadoc")
public enum Parameter {
	ID, NAME, AUTHOR, SUBJECT, SET, Q, PUBLISHER, ISSUED, MEDIUM, NWBIBSPATIAL, NWBIBSUBJECT, LOCATION;
	/**
	 * @return The parameter id (the string passed to the API)
	 */
	public String id() { // NOPMD
		return name().toLowerCase();
	}

	public static Map<Parameter, String> select(
			ImmutableMap<Parameter, String> params) {
		Map<Parameter, String> selected = new HashMap<>();
		for (Map.Entry<Parameter, String> p : params.entrySet())
			if (isDefined(p.getValue()))
				selected.put(p.getKey(), p.getValue());
		return selected;
	}

	private static boolean isDefined(final String param) {
		return !param.isEmpty();
	}
}
