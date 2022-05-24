import TodoItem from './TodoItem.vue'

export default {
  components: {
    TodoItem
  },
  data() {
    return {
      groceryList: [
        { id: 0, text: '蔬菜' },
        { id: 1, text: '奶酪' },
        { id: 2, text: '人类还能吃什么' }
      ]
    }
  }
}
