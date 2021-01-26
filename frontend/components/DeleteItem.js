import React, { Component } from "react";
import { Mutation } from "react-apollo";
import { ALL_ITEMS_QUERY } from "./Items";
import gql from "graphql-tag";

const DELETE_ITEM_MUTATION = gql`
    mutation DELETE_ITEM_MUTATION($id: ID!){
        deleteItem(id: $id){
            id
        }
}`;

class DeleteItem extends Component {

    update = (cache, payload) => {
        // UPDATE CACHE ON CLIENT TO MATCH SERVER

        const data = cache.readQuery({query: ALL_ITEMS_QUERY})
        data.items = data.items.filter(item => 
            item.id !== payload.data.deleteItem.id
        )
        cache.writeQuery({ query: ALL_ITEMS_QUERY, data })

    }

  render() {
    return (
        <Mutation 
            mutation={DELETE_ITEM_MUTATION} 
            variables={{id: this.props.id}}
            update={this.update}>
            {(deleteItem, { error }) => {
                return(
                    <button onClick={() => {
                        // LETS MAKE A POP UP MODULE FOR THIS RATHER THAN AN ALERT
                        if(confirm("Are you sure you wish to delete this item?")){
                            deleteItem();
                        }
                    }}>
                        Delete
                    </button>
                )
            }}
        </Mutation>
    );
  }
}

export default DeleteItem;
