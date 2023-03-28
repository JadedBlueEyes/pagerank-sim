import Graph from "graphology";

const defaultDampening = 0.85;

/**
 * @param {Graph} graph 
 */
export function rankEdges (graph) {
    graph.nodes().forEach((node) => {
        let score = graph.getNodeAttribute(node, "score")
        let edges = graph.outEdges(node)
        let count = edges.length

        let edgeValue = (score / count)
        graph.outEdges(node).forEach((edge) => {
            graph.setEdgeAttribute(edge, "score", edgeValue)
            graph.setEdgeAttribute(edge, "size", score * 2.5)
        })
    })
}

/**
 * @param {Graph} graph 
 */
export function rankNodes (graph, dampening) {
    dampening = dampening ?? defaultDampening
    graph.nodes().forEach((node) => {
        let score = 1 - dampening
        graph.inEdges(node).forEach((edge) => {
            let value = graph.getEdgeAttribute(edge, "score")
            score = score + (dampening * value)
        })
        graph.setNodeAttribute(node, "score", score)
        graph.setNodeAttribute(node, "size", score * 25)
    })
}