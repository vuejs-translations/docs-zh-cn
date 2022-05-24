import { ref } from 'vue'
import TodoItem from './TodoItem.vue'

export default {
  components: {
    TodoItem
  },
  setup() {
    const groceryList = ref([
      { id: 0, text: '蔬菜' },
      { id: 1, text: '奶酪' },
      { id: 2, text: '人类还能吃什么' }
    ])

    return {
      groceryList
    }
  }
}
