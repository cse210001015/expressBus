class MinHeap {
    constructor() {
      this.heap = [];
    }
  
    push(node) {
      this.heap.push(node);
      this.heapifyUp();
    }
  
    pop() {
      if (this.isEmpty()) {
        return null;
      }
  
      if (this.heap.length === 1) {
        return this.heap.pop();
      }
  
      const root = this.heap[0];
      this.heap[0] = this.heap.pop();
      this.heapifyDown();
  
      return root;
    }
  
    isEmpty() {
      return this.heap.length === 0;
    }
  
    heapifyUp() {
      let currentIndex = this.heap.length - 1;
  
      while (currentIndex > 0) {
        const parentIndex = Math.floor((currentIndex - 1) / 2);
        if (this.heap[currentIndex].time < this.heap[parentIndex].time) {
          [this.heap[currentIndex], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[currentIndex]];
          currentIndex = parentIndex;
        } else {
          break;
        }
      }
    }
  
    heapifyDown() {
      let currentIndex = 0;
  
      while (true) {
        const leftChildIndex = 2 * currentIndex + 1;
        const rightChildIndex = 2 * currentIndex + 2;
        let smallerChildIndex = null;
  
        if (leftChildIndex < this.heap.length) {
          smallerChildIndex = leftChildIndex;
        }
  
        if (rightChildIndex < this.heap.length && this.heap[rightChildIndex].time < this.heap[leftChildIndex].time) {
          smallerChildIndex = rightChildIndex;
        }
  
        if (smallerChildIndex !== null && this.heap[smallerChildIndex].time < this.heap[currentIndex].time) {
          [this.heap[currentIndex], this.heap[smallerChildIndex]] = [this.heap[smallerChildIndex], this.heap[currentIndex]];
          currentIndex = smallerChildIndex;
        } else {
          break;
        }
      }
    }
  }

  export {MinHeap};