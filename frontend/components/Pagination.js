import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Head from "next/head";
import Link from "next/link";
import { perPage } from "../config";
import PaginationStyles from "./styles/PaginationStyles";

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`;

const Pagination = ({ page }) => {
  return (
    <Query query={PAGINATION_QUERY}>
      {({ data, loading, error }) => {
        if (loading) {
          return <p>Loading...</p>;
        }

        const count = data.itemsConnection.aggregate.count;
        const pages = Math.ceil(count / perPage);

        return (
          <PaginationStyles>
            <Head>
              <title>
                Sick Fits! | Page {page} of {pages}
              </title>
            </Head>
            {page > 1 && (
              <Link
                prefetch
                href={{
                  pathname: "items",
                  query: { page: page - 1 },
                }}
              >
                <a className="prev" href="">
                Prev
                </a>
              </Link>
            )}
            <p>
              Page {page} of
              <span className="totalPages"> {pages}</span>
            </p>
            {page < pages && (
              <Link
                prefetch
                href={{
                  pathname: "items",
                  query: { page: page + 1 },
                }}
              >
                <a className="next" href="">
                  Next
                </a>
              </Link>
            )}
          </PaginationStyles>
        );
      }}
    </Query>
  );
};

export default Pagination;
