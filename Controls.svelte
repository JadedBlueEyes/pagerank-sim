<script>
  import Graph from "graphology";
  /**
   * @type Graph
   */
  export let graph;
  import { updating } from "./updating";
  let nodes = graph.nodes();
  function update() {
    nodes = graph.nodes();
    requestAnimationFrame(update);
  }
  update();

  let node_label = "";

  let source;
  let target;

  let delete_node;
  let delete_link;
</script>

<h1>Pagerank simulator</h1>

<label>
  <input type="checkbox" bind:checked={$updating} />
  Updating?
</label>

<h2>Add node:</h2>
<form
  on:submit|preventDefault={() =>
    graph.addNode(Math.random(), { label: node_label })}
>
  <label for="node_label">Node label:</label>
  <input type="text" name="node_label" bind:value={node_label} />
  <input type="submit" value="Add node" />
</form>

<h2>Delete node:</h2>
<form
  on:submit|preventDefault={() => {
    graph.dropNode(delete_node);
    delete_node = "";
  }}
>
  <label for="delete_node">Node to delete: </label>
  <select name="delete_node" bind:value={delete_node}>
    {#each nodes as node (node)}
      <option value={node}>
        {graph.getNodeAttribute(node, "label")}
      </option>
    {/each}
  </select>
  <input type="submit" value="Delete node" disabled={!delete_node} />
</form>

<h2>Add link:</h2>
<form on:submit|preventDefault={() => graph.addDirectedEdge(source, target)}>
  <label for="source">Source: </label>
  <select name="source" bind:value={source}>
    {#each nodes as node (node)}
      <option value={node}>
        {graph.getNodeAttribute(node, "label")}
      </option>
    {/each}
  </select>
  <label for="target">Target: </label>
  <select name="target" bind:value={target}>
    {#each nodes as node (node)}
      <option value={node}>
        {graph.getNodeAttribute(node, "label")}
      </option>
    {/each}
  </select>
  <input type="submit" value="Add link" />
</form>

<h2>Delete link:</h2>
<form
  on:submit|preventDefault={() => {
    graph.dropEdge(delete_link);
    delete_link = "";
  }}
>
  <label for="delete_link">Link to delete: </label>
  <select name="delete_link" bind:value={delete_link}>
    {#each nodes as node (node)}
      <optgroup label={graph.getNodeAttribute(node, "label")}>
        {#each graph.outEdges(node) as edge (edge)}
          <option value={edge}
            >{graph.getNodeAttribute(graph.source(edge), "label")} -> {graph.getNodeAttribute(
              graph.target(edge),
              "label"
            )} ({edge})</option
          >
        {/each}
      </optgroup>
    {/each}
  </select>
  <input type="submit" value="Delete link" disabled={!delete_link} />
</form>
<hr />
<ul>
  {#each nodes as node (node)}
    <li>
      <p>{graph.getNodeAttribute(node, "label")}</p>
      <ul>
        {#each graph.outEdges(node) as edge (edge)}
          <li>
            {graph.getNodeAttribute(graph.target(edge), "label")} ({edge})
          </li>
        {/each}
      </ul>
    </li>
  {/each}
</ul>
