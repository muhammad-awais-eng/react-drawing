import React, { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import SourceTable from "./SourceTable";
import axios from "axios";

import "./style.css";
const DragableComponent = () => {
  const [todos, setTodos] = useState([]);

  //  { id: 1, name: "first table" },
  //   { id: 2, name: "second table" },
  //   { id: 3, name: "third table" },
  //   { id: 4, name: "fourth table" },
  //   { id: 5, name: "fifth table" },
  useEffect(() => {
    try {
      axios
        .get("/v1/list_db_connections", {
          headers: {
            "X-User-ID": 1,
            "X-Access-Token": "9GdJaJxa7O0B-mk0fxzYNw",
          },
        })
        .then((response) => {
          console.log(response.data.result_list);
          console.log(Object.keys(response.data.result_list));
          const data = Object.keys(response.data.result_list);

          data.map((item, index) => {
            console.log(item);
            setTodos((data) => [...data, { id: index, name: item }]);
          });
        })
        .catch((error) => {
          console.log(error);
          alert("please check your credientials");
        });
    } catch (e) {
      console.log(e);
    }
  }, []);

  const [CompletedTodos, setCompletedTodos] = useState([]);

  const onDragEnd = (result) => {
    const { destination, source } = result;

    console.log(result);

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    let add;
    let active = todos;
    let complete = CompletedTodos;
    // Source Logic
    if (source.droppableId === "TodosList") {
      add = active[source.index];
      active.splice(source.index, 1);
    } else {
      add = complete[source.index];
      complete.splice(source.index, 1);
      console.log("esle");
    }
    //Destination Logic
    if (destination.droppableId === "TodosList") {
      active.splice(destination.index - 1, 0, add);
      console.log("des if");
    } else {
      complete.splice(destination.index, 0, add);

      console.log("dest else");
    }

    console.log(active, complete);
    setCompletedTodos(complete);
    setTodos(active);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div>
        <div>
          <SourceTable
            todos={todos}
            setTodos={setTodos}
            completedTodos={CompletedTodos}
            setCompletedTodos={setCompletedTodos}
          />
        </div>
      </div>
    </DragDropContext>
  );
};

export default DragableComponent;
