import React, { useEffect, useState } from "react";
import axios from "axios";

import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";

function TreeFile() {
  const [taskMapperEngine, setTaskMapperEngine] = useState([]);

  useEffect(() => {
    try {
      axios
        .get("/v1/list_task_mappings", {
          headers: {
            "X-User-ID": 1,
            "X-Access-Token": "9GdJaJxa7O0B-mk0fxzYNw",
          },
        })
        .then((response) => {
          console.log(typeof response.data, response.data);
          setTaskMapperEngine(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <div>
      <TreeView
        aria-label="multi-select"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        multiSelect
        sx={{ height: 516, flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
      >
        <TreeItem nodeId="1" label="Folder">
          <TreeItem nodeId="2" label="Packages">
            <TreeItem nodeId="3" label="Landing">
              {taskMapperEngine["process_groups"] &&
                taskMapperEngine["process_groups"]["landings"].map(
                  (item, idx) => {
                    console.log(item);
                    return (
                      <TreeItem
                        key={idx}
                        nodeId={(Math.random() * 1000)
                          .toString(36)
                          .substring(7)}
                        label={item.task_name}
                      />
                    );
                  }
                )}
            </TreeItem>
          </TreeItem>
          <TreeItem nodeId="4" label="Mapping">
            {taskMapperEngine["process_individuals"] &&
              taskMapperEngine["process_individuals"].map((item, idx) => {
                console.log(item);
                return (
                  <TreeItem
                    key={idx}
                    nodeId={(Math.random() * 9000).toString(36).substring(7)}
                    label={item.task_name}
                  />
                );
              })}
          </TreeItem>
        </TreeItem>
      </TreeView>
    </div>
  );
}

export default TreeFile;

// {
//   Object.keys(taskMapperEngine).map((item, idx) => (
//     <TreeItem key={idx} nodeId={item} label={item}>
//       {console.log(taskMapperEngine[item], "dasgd", idx)}
//       {/* {taskMapperEngine[item].map((item, idx) => {
//                 console.log(item);
//                 // return <TreeItem key={item} nodeId={item.id} label={item.id} />
//               })} */}
//     </TreeItem>
//   ));
// }
