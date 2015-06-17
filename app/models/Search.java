/* Copyright 2013 Fabian Steeg, hbz. Licensed under the Eclipse Public License 1.0 */

package models;

import static org.elasticsearch.index.query.QueryBuilders.boolQuery;
import static org.elasticsearch.index.query.QueryBuilders.matchQuery;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;

import models.queries.LobidItems;
import models.queries.LobidResources;

import org.apache.commons.lang3.tuple.ImmutablePair;
import org.apache.commons.lang3.tuple.Pair;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchType;
import org.elasticsearch.client.Client;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.settings.ImmutableSettings;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.FilterBuilders;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.sort.SortBuilders;
import org.elasticsearch.search.sort.SortOrder;

import play.Logger;

import com.google.common.base.Joiner;
import com.google.common.base.Predicate;
import com.google.common.collect.ImmutableList;
import com.google.common.collect.Iterables;

/**
 * Search documents in an ElasticSearch index.
 * 
 * @author Fabian Steeg (fsteeg)
 */
public class Search {

	/** The ElasticSearch server to use. */
	public static final InetSocketTransportAddress ES_SERVER =
			new InetSocketTransportAddress(
					Index.CONFIG.getString("application.es.server"),
					Index.CONFIG.getInt("application.es.port"));
	/** The ElasticSearch cluster to use. */
	public static final String ES_CLUSTER_NAME = Index.CONFIG
			.getString("application.es.cluster");

	private static Client productionClient = new TransportClient(
			ImmutableSettings.settingsBuilder().put("cluster.name", ES_CLUSTER_NAME)
					.build()).addTransportAddress(ES_SERVER);
	/** The ElasticSearch client to use. */
	public static Client client = productionClient;
	/* TODO find a better way to inject the client for testing */

	/** Required: */
	private Index index;
	private Map<Parameter, String> parameters;

	/** Optional: */
	private String field = "";
	private String owner = "";
	private String set = "";
	private int size = 50;
	private int from = 0;
	private String type = "";
	private String sort = "";

	private List<Document> documents = null;
	private Long hitCount = null;

	/**
	 * @param parameters The search parameters (see {@link Index#queries()} )
	 * @param index The index to search (see {@link Index})
	 */
	public Search(final Map<Parameter, String> parameters, final Index index) {
		if (parameters == null) {
			throw new IllegalArgumentException("Can't work with null parameters");
		}
		this.index = index;
		this.parameters = parameters;
	}

	/** @param newClient The new elasticsearch client to use. */
	public static void clientSet(Client newClient) {
		client = newClient;
	}

	/** Reset the elasticsearch client. */
	public static void clientReset() {
		client = productionClient;
	}

	/**
	 * Execute the search and return its results.
	 * 
	 * @return The documents matching this search
	 */
	public List<Document> documents() {
		if (documents == null)
			initResults();
		return documents;
	}

	/**
	 * @return The total number of hits for this search.
	 */
	public long totalHits() {
		if (hitCount == null)
			initResults();
		return hitCount;
	}

	private void initResults() {
		Pair<List<Document>, Long> result = doSearch();
		this.documents = result.getLeft();
		this.hitCount = result.getRight();
	}

	private Pair<List<Document>, Long> doSearch() {
		validateSearchParameters();

		final QueryBuilder queryBuilder = createQuery();
		Logger.trace("Using query: " + queryBuilder);
		final SearchResponse response = search(queryBuilder);
		Logger.trace("Got response: " + response);
		final SearchHits hits = response.getHits();
		final List<Document> docs = asDocuments(hits, fields(parameters));
		final Pair<List<Document>, Long> result =
				new ImmutablePair<>(docs, hits.getTotalHits());
		Logger.debug(String.format("Got %s hits overall, created %s matching docs",
				hits.getTotalHits(), docs.size()));
		return result;
	}

	private List<String> fields(Map<Parameter, String> queries) {
		return queries.keySet().stream()
				.flatMap(p -> index.queries().get(p).fields().stream())
				.collect(Collectors.toList());
	}

	/**
	 * Optional: specify a field to pick from the full result
	 * 
	 * @param resultField The field to return as the result
	 * @return this search object (for chaining)
	 */
	public Search field(final String resultField) {
		this.field = resultField;
		return this;
	}

	/**
	 * Optional: specify a resource owner
	 * 
	 * @param resourceOwner An ID for the owner of requested resources
	 * @return this search object (for chaining)
	 */
	public Search owner(final String resourceOwner) {
		this.owner = resourceOwner;
		return this;
	}

	/**
	 * Optional: specify a resource set
	 * 
	 * @param resourceSet An ID for the set the requested resources should be in
	 * @return this search object (for chaining)
	 */
	public Search set(final String resourceSet) {
		this.set = resourceSet;
		return this;
	}

	/**
	 * Optional: specify the page size
	 * 
	 * @param pageFrom The start index of the result set
	 * @param pageSize The size of the result set
	 * @return this search object (for chaining)
	 */
	public Search page(final int pageFrom, final int pageSize) {
		this.from = pageFrom;
		this.size = pageSize;
		return this;
	}

	/**
	 * Optional: specify a type
	 * 
	 * @param resourceType The type of the requested resources
	 * @return this search object (for chaining)
	 */
	public Search type(final String resourceType) {
		this.type = resourceType;
		return this;
	}

	/**
	 * Optional: specify a sort order
	 * 
	 * @param sortOrder The sort order: newest, oldest
	 * @return this search object (for chaining)
	 */
	public Search sort(final String sortOrder) {
		this.sort = sortOrder;
		return this;
	}

	/**
	 * @return The query object for this search
	 */
	public QueryBuilder createQuery() {
		QueryBuilder queryBuilder = boolQueryFromParams();
		if (!owner.isEmpty() && !owner.equals("*")) {
			final QueryBuilder itemQuery = new LobidItems.OwnerQuery().build(owner);
			queryBuilder = boolQuery().must(queryBuilder).must(itemQuery);
		}
		if (!set.isEmpty()) {
			final QueryBuilder setQuery = new LobidResources.SetQuery().build(set);
			queryBuilder = boolQuery().must(queryBuilder).must(setQuery);
		}
		if (!type.isEmpty()) {
			BoolQueryBuilder typeQuery = boolQuery();
			for (String t : type.split(","))
				typeQuery = typeQuery.should(matchQuery("@graph.@type", t));
			queryBuilder = boolQuery().must(queryBuilder).must(typeQuery);
		}
		if (queryBuilder == null)
			throw new IllegalStateException(String.format(
					"Could not construct query for queries '%s', owner '%s'",
					queryBuilder, owner));
		return queryBuilder;
	}

	private QueryBuilder boolQueryFromParams() {
		BoolQueryBuilder builder = boolQuery();
		for (QueryBuilder q : getQueries()) {
			builder = builder.must(q);
		}
		return builder;
	}

	private List<QueryBuilder> getQueries() {
		List<QueryBuilder> res = new ArrayList<>();
		for (Entry<Parameter, String> entry : parameters.entrySet()) {
			res.add(index.queries().get(entry.getKey()).build(entry.getValue()));
		}
		return res;
	}

	private void validateSearchParameters() {
		if (index == null) {
			throw new IllegalArgumentException(String.format(
					"Invalid index ('%s') - valid indexes: %s", index, Index.values()));
		}
		for (Entry<Parameter, String> entry : parameters.entrySet()) {
			Parameter parameter = entry.getKey();
			if (!index.queries().containsKey(parameter)) {
				throw new IllegalArgumentException(String.format(
						"Invalid parameter ('%s') for specified index ('%s') - valid: %s",
						parameter, index, index.queries().keySet()));
			}
		}
		if (from < 0) {
			throw new IllegalArgumentException("Parameter 'from' must be positive");
		}
		if (size > 100) {
			throw new IllegalArgumentException("Parameter 'size' must be <= 100");
		}
		final List<String> sortSupported = Arrays.asList("newest", "oldest");
		if (!sort.isEmpty() && !sortSupported.contains(sort)) {
			throw new IllegalArgumentException("Parameter 'sort' must be one of: "
					+ Joiner.on(", ").join(sortSupported));
		}
	}

	private SearchResponse search(final QueryBuilder queryBuilder) {
		SearchRequestBuilder requestBuilder =
				client.prepareSearch(index.id())
						.setSearchType(SearchType.DFS_QUERY_THEN_FETCH)
						.setQuery(queryBuilder)
						.setPostFilter(FilterBuilders.typeFilter(index.type()));
		if (owner.equals("*"))
			requestBuilder =
					requestBuilder.setPostFilter(FilterBuilders.existsFilter(//
							"@graph.http://purl.org/vocab/frbr/core#exemplar.@id"));
		if (!sort.isEmpty()) {
			requestBuilder.addSort(SortBuilders
					.fieldSort("@graph.http://purl.org/dc/terms/issued.@value")
					.order(sort.equals("newest") ? SortOrder.DESC : SortOrder.ASC)
					.ignoreUnmapped(true));
		}
		final SearchResponse response =
				requestBuilder.setFrom(from).setSize(size).setExplain(false).execute()
						.actionGet();
		return response;
	}

	private List<Document> asDocuments(final SearchHits hits,
			final List<String> searchFields) {
		final List<Document> res = new ArrayList<>();
		for (SearchHit hit : hits) {
			try {
				Hit hitEnum = Hit.of(hit, searchFields);
				final Document document =
						new Document(hit.getId(), new String(hit.source()), index, field);
				res.add(hitEnum
						.process(parameters.values().iterator().next(), document));
			} catch (IllegalArgumentException e) {
				Logger.error(e.getMessage(), e);
			}
		}
		final Predicate<Document> predicate = doc -> {
			return doc.matchedField != null;
		};
		return ImmutableList.copyOf(Iterables.filter(res, predicate));
	}
}
