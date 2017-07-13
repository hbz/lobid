/* Copyright 2012-2013 Fabian Steeg, hbz. Licensed under the Eclipse Public License 1.0 */

package controllers;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.function.Supplier;

import org.apache.commons.lang3.tuple.ImmutablePair;
import org.apache.commons.lang3.tuple.Pair;
import org.elasticsearch.indices.IndexMissingException;
import org.lobid.lodmill.JsonLdConverter;
import org.lobid.lodmill.JsonLdConverter.Format;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.common.base.Function;
import com.google.common.base.Joiner;
import com.google.common.collect.FluentIterable;
import com.google.common.collect.ImmutableMap;
import com.google.common.collect.ImmutableSet;
import com.google.common.collect.ImmutableSortedSet;
import com.google.common.collect.Iterables;
import com.google.common.collect.Lists;

import models.Document;
import models.Index;
import models.Parameter;
import models.Search;
import play.Logger;
import play.api.http.MediaRange;
import play.libs.F;
import play.libs.F.Promise;
import play.libs.Json;
import play.libs.ws.WS;
import play.libs.ws.WSResponse;
import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.Http.Request;
import play.mvc.Result;
import play.twirl.api.Html;
import scala.concurrent.ExecutionContext;

/**
 * Main application controller.
 *
 * @author Fabian Steeg (fsteeg)
 */
public final class Application extends Controller {
	/**
	 * Error message when http status codes 406 aka "not acceptable"
	 */
	public final static String HTTP_CODE_406_MESSAGE =
			"Not acceptable: unsupported content type requested\n";

	private Application() { // NOPMD
		/* No instantiation */
		@SuppressWarnings("unused")
		ExecutionContext ec; // to retain import
	}

	/**
	 * @return The main page.
	 */
	public static Promise<Result> index() {
		return okPromise(views.html.index.render());
	}

	/**
	 * @return The main page.
	 */
	public static Promise<Result> v1() {
		return okPromise(views.html.v1.render());
	}

	/**
	 * @return The API page.
	 */
	public static Promise<Result> api() {
		return okPromise(views.html.api.render());
	}

	/**
	 * @return The main page.
	 */
	public static Promise<Result> contact() {
		return Promise.pure(movedPermanently(routes.LobidTeam.team()));
	}

	/**
	 * @return The main page.
	 */
	public static Promise<Result> about() {
		return okPromise(views.html.about.render());
	}

	/**
	 * Search enpoint for actual queries.
	 *
	 * @param indexParameter The index to search (see {@link Index}).
	 * @param parameter The search parameter type (see {@link Parameter}).
	 * @param queryParameter The search query
	 * @param formatParameter The result format
	 * @param from The start index of the result set
	 * @param size The size of the result set
	 * @param format The result format requested
	 * @param owner The ID of an owner holding items of the requested resources
	 * @param set The ID of a set the requested resources should be part of
	 * @param type The type of the requestes resources
	 * @param sort The sort order
	 * @return The results, in the format specified
	 * @throws InterruptedException
	 */
	static Promise<Result> search(final Index index,
			final java.util.Map<Parameter, String> parameters,
			final String formatParameter, final int from, final int size,
			final String owner, final String set, final String type,
			final String sort, final boolean addQueryInfo, final String scroll) {
		final ResultFormat resultFormat;
		try {
			resultFormat = ResultFormat
					.valueOf(getFieldAndFormat(formatParameter).getRight().toUpperCase());
		} catch (IllegalArgumentException e) {
			return badRequestPromise("Invalid 'format' parameter, use one of: "
					+ Joiner.on(", ").join(ResultFormat.values()).toLowerCase());
		}
		Search search;
		try {
			search = new Search(parameters, index).page(from, size)
					.field(getFieldAndFormat(formatParameter).getLeft()).owner(owner)
					.set(set).type(type).sort(sort).scroll(scroll);
		} catch (IllegalArgumentException e) {
			Logger.error(e.getMessage(), e);
			return badRequestPromise(e.getMessage());
		}
		if (!scroll.isEmpty()) {
			if (search.doingScrollScanNow()) {
				return Promise.pure(status(Http.Status.CONFLICT,
						"Already doing a scroll scan. Only one permitted. Please try again later."));
			}
			if (search.getTotalHits() > Search.MAX_SCROLL_HITS) {
				return Promise.pure(status(Http.Status.REQUEST_ENTITY_TOO_LARGE,
						"The requested entity is too large. Not more than "
								+ Search.MAX_SCROLL_HITS + " hits are allowed."));
			}
			Serialization serialization = getSerialization(request());
			if (serialization == null)
				return Promise
						.pure(status(Http.Status.NOT_ACCEPTABLE, HTTP_CODE_406_MESSAGE));
			response().setHeader("Transfer-Encoding", "Chunked");
			try {
				return Promise
						.pure(ok(search.executeScrollScan(request(), serialization)));
			} catch (IllegalArgumentException e) {
				Logger.error(e.getMessage(), e);
				return badRequestPromise(e.getMessage());
			}
		}
		try {
			List<Document> docs = search.documents();
			long allHits = search.totalHits();
			final Promise<ImmutableMap<ResultFormat, Supplier<Result>>> resultPromise =
					resultsPromise(docs, index,
							getFieldAndFormat(formatParameter).getLeft(), allHits,
							addQueryInfo);
			return resultPromise.map(results -> {
				return results.get(resultFormat).get();
			});
		} catch (IllegalArgumentException e) {
			Logger.error(e.getMessage(), e);
			return badRequestPromise(e.getMessage());
		}
	}

	private static Promise<ImmutableMap<ResultFormat, Supplier<Result>>> resultsPromise(
			final List<Document> docs, final Index index, final String field,
			final long allHits, final boolean addQueryInfo) {
		return Promise.promise(() -> {
			return results(docs, index, field, allHits, addQueryInfo);
		});
	}

	static Promise<Result> badRequestPromise(final String message) {
		return Promise.promise(() -> {
			return badRequest(message);
		});
	}

	static Promise<Result> okPromise(final Html html) {
		return Promise.promise(() -> {
			return ok(html);
		});
	}

	private static Pair<String, String> getFieldAndFormat(final String format) {
		if (format.contains(".")) {
			final String[] strings = format.split("\\.");
			if (strings.length != 2 || !strings[0].equals("short"))
				throw new IllegalArgumentException(
						"Parameter modifier only supported on `short` format, "
								+ "e.g. `format=short.fulltextOnline`.");
			return new ImmutablePair<>(strings[1], "full");
		}
		return new ImmutablePair<>("", format);
	}

	private static Function<Document, JsonNode> jsonLabelValue = doc -> {
		final ObjectNode object = Json.newObject();
		object.put("label", doc.getMatchedField());
		object.put("value", doc.getId());
		return object;
	};

	private static ImmutableMap<ResultFormat, Supplier<Result>> results(
			final List<Document> documents, final Index selectedIndex,
			final String field, long allHits, boolean addQueryInfo) {
		/* JSONP callback support for remote server calls with JavaScript: */
		final String[] callback =
				request() == null || request().queryString() == null ? null
						: request().queryString().get("callback");
		Serialization ser = getSerialization(request());
		Result negotiateRes;
		if (ser == null) {
			negotiateRes = status(Http.Status.NOT_ACCEPTABLE, HTTP_CODE_406_MESSAGE);
		} else
			negotiateRes = ok(getSerializedResult(documents, selectedIndex, field,
					allHits, addQueryInfo, request(), ser)).as(ser.getTypes().get(0));
		final ImmutableMap<ResultFormat, Supplier<Result>> results =
				new ImmutableMap.Builder<ResultFormat, Supplier<Result>>()
						.put(ResultFormat.NEGOTIATE, () -> negotiateRes)
						.put(ResultFormat.FULL,
								() -> withCallback(callback,
										fullJsonResponse(documents, field, allHits, addQueryInfo,
												request())))
						.put(ResultFormat.SHORT, () -> withCallback(callback, Json
								.toJson(new LinkedHashSet<>(Lists.transform(documents, doc -> {
									return doc.getMatchedField();
								})))))
						.put(ResultFormat.INTERNAL, () -> internalJsonResponse(documents))
						.put(ResultFormat.IDS,
								() -> withCallback(callback,
										Json.toJson(Lists.transform(documents, jsonLabelValue))))
						.put(ResultFormat.SOURCE, () -> mabXml(documents)).build();
		return results;
	}

	private static Result mabXml(final List<Document> documents) {
		try {
			final StringBuilder builder = new StringBuilder();
			final String errorMessage = "No source data found for ";
			for (Document document : documents)
				if (document.getId().contains("lobid.org/resource"))
					appendMabXml(builder, errorMessage, document);
			final String result = builder.toString().trim();
			return result.isEmpty() ? notFound(errorMessage + "request") : //
					documents.size() > 1 ? ok(result)
							: ok(result).as("text/xml; charset: utf-8");
		} catch (IndexMissingException e) {
			return notFound(e.getMessage());
		}
	}

	private static void appendMabXml(final StringBuilder builder,
			final String errorMessage, Document document) {
		JsonNode value = Json.parse(document.getSource()).findValue("hbzId");
		String mabXml = null;
		if (value != null) {
			final String id = value.textValue();
			String url = Index.CONFIG.getString("hbz01.api") + "/" + id;
			Promise<String> promise = WS.url(url).get().map((WSResponse response) -> {
				if (response.getStatus() == Http.Status.OK) {
					return new String(response.asByteArray(), StandardCharsets.UTF_8);
				}
				Logger.warn("Response for {} not OK: {}", url,
						response.getStatusText());
				return null;
			});
			promise = promise.recover(new F.Function<Throwable, String>() {
				@Override
				public String apply(Throwable t) throws Throwable {
					Logger.error("Could not get response for {}: {}", url, t);
					return null;
				}
			});
			mabXml = promise.get(10000);
		}
		if (mabXml == null)
			Logger.warn(errorMessage + document.getId());
		else
			builder.append(mabXml).append("\n");
	}

	private static Status withCallback(final String[] callback,
			final JsonNode shortJson) {
		return callback != null
				? ok(String.format("/**/%s(%s)", callback[0], shortJson))
				: ok(shortJson);
	}

	private static JsonNode fullJsonResponse(final List<Document> documents,
			final String field, long allHits, boolean addQueryInfo, Request request) {
		Iterable<JsonNode> nonEmptyNodes =
				Iterables.filter(Lists.transform(documents, doc -> {
					return Json.parse(doc.getSource());
				}), node -> {
					return node.size() > 0;
				});
		if (!field.isEmpty()) {
			nonEmptyNodes = ImmutableSortedSet.<JsonNode> copyOf((o1, o2) -> {
				return o1.asText().compareTo(o2.asText());
			}, FluentIterable.from(nonEmptyNodes).transformAndConcat(input -> {
				return input.isArray() ? /**/
				Lists.newArrayList(input.elements()) : Lists.newArrayList(input);
			}));
		}
		List<JsonNode> data = new ArrayList<>();
		if (addQueryInfo)
			data.add(queryInfo(allHits, request));
		data.addAll(ImmutableSet.copyOf(nonEmptyNodes));
		return Json.toJson(data);
	}

	private static Result internalJsonResponse(final List<Document> documents) {
		try {
			final StringBuilder builder = new StringBuilder();
			for (Document document : documents)
				builder.append(document.getEsSource()).append("\n");
			final String result = builder.toString().trim();
			return documents.size() > 1 ? ok(result) : ok(result).as("text/xml");
		} catch (IndexMissingException e) {
			return notFound(e.getMessage());
		}
	}

	private static JsonNode queryInfo(long allHits, Request request) {
		return Json.toJson(ImmutableMap.of(//
				"@id", "http://lobid.org" + request.uri(), //
				"http://sindice.com/vocab/search#totalResults", allHits));
	}

	/**
	 * @param request The http request.
	 * @return the serialization
	 */
	public static Serialization getSerialization(Request request) {
		if (invalidAcceptHeader(request))
			return null;
		for (MediaRange mediaRange : request.acceptedTypes())
			for (Serialization serialization : Serialization.values())
				for (String mimeType : serialization.getTypes())
					if (mediaRange.accepts(mimeType))
						return serialization;
		return null;
	}

	/**
	 * @param documents A list of documents. These will be serialized according to
	 *          the requested content type.
	 * @param selectedIndex The elasticsearch index
	 * @param field A field to be sorted. Only used in conjunction of "format".
	 * @param allHits Number of hits.
	 * @param addQueryInfo Boolean if query info should be added.
	 * @param request The request of the client, with headers etc.
	 * @param serialization The wanted serialization of the result.
	 * @return the result of the serialization of the hits as String.
	 */
	public static String getSerializedResult(List<Document> documents,
			Index selectedIndex, String field, long allHits, boolean addQueryInfo,
			Request request, Serialization serialization) {
		return serialization(documents, selectedIndex, serialization, field,
				allHits, addQueryInfo, request);
	}

	private static String serialization(List<Document> documents,
			Index selectedIndex, Serialization serialization, String field,
			long allHits, boolean addQueryInfo, Request request) {
		switch (serialization) {
		case JSON_LD:
			return fullJsonResponse(documents, field, allHits, addQueryInfo, request)
					.toString();
		case RDF_A:
			return views.html.docs.render(documents, selectedIndex).toString();
		case RDF_XML:
			return "<docs>" + Joiner.on("\n").join(
					transform(documents, serialization, allHits, addQueryInfo, request))
					+ "</docs>"; // serve well-formed XML, retain document structure
		default:
			return Joiner.on("\n").join(
					transform(documents, serialization, allHits, addQueryInfo, request));
		}
	}

	private static boolean invalidAcceptHeader(Request request) {
		if (request == null)
			return true;
		final String acceptHeader = request.getHeader("Accept");
		return (acceptHeader == null || acceptHeader.trim().isEmpty());
	}

	private static List<String> transform(List<Document> documents,
			final Serialization serialization, long allHits, boolean addQueryInfo,
			Request request) {
		List<String> transformed = new ArrayList<>();
		if (addQueryInfo)
			transformed.add(transformed(queryInfo(allHits, request).toString(),
					serialization.format));
		transformed.addAll(Lists.transform(documents, doc -> {
			return doc.as(serialization.format);
		}));
		return transformed;
	}

	private static String transformed(String jsonLdInfo, Format format) {
		final JsonLdConverter converter = new JsonLdConverter(format);
		return converter.toRdf(jsonLdInfo).trim();
	}

	/**
	 * @return 303 redirect to the referrer, after toggling the current language
	 */
	public static Result toggleLanguage() {
		boolean isEnglish = currentLang().equals("en");
		changeLang(isEnglish ? "de" : "en");
		return seeOther(request().getHeader(REFERER).replaceAll("en|de", ""));
	}

	/**
	 * @return The current language: "en" or "de"
	 */
	public static String currentLang() {
		return lang().code().split("-")[0];
	}

}
