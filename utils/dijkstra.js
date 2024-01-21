import {MinHeap} from './heap.js';

function dijkstra(locations, startLoc, endLoc, startTime, k) {
    const distance = {};
    const pq = new MinHeap();
    let completed = 0;

    pq.push({
        location: startLoc,
        time: startTime,
        parent: null
    });
    while(completed<k && !pq.isEmpty()) {
        const node = pq.pop();

        if(node.location == endLoc) {
            completed += 1;
            if(!distance[endLoc]){
                distance[endLoc] = [];
            }
            distance[endLoc].push(node);
            continue;
        }         

        if(!distance[node.location]){
            distance[node.location] = [];
        }

        if(distance[node.location].length<k)  {
            distance[node.location].push(node);
            for(const adj of locations[node.location]) {
                const newNode = {};
                newNode.location = adj[1];
                newNode.time = adj[2];
                newNode.parent = [node.location, distance[node.location].length-1];
                newNode.bus = adj[3];
                if(node.time<=adj[0])       pq.push(newNode);
            }
        }
    }

    const ans = [];
    for(const dist of distance[endLoc]) {
        const res = [];
        let node = dist;
        res.push(node);
        while(node.parent) {
            node = distance[node.parent[0]][node.parent[1]];
            res.push(node);
        }
        res.reverse();
        ans.push(res);
    }   
    return ans;
}

export {dijkstra};