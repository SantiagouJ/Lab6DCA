import { Task } from '../services/task-service';

export class TodoItem extends HTMLElement {
    private task!: Task;
    private index!: number;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const title = this.getAttribute('data-title');
        const completed = this.getAttribute('data-completed') === 'true';
        const index = parseInt(this.getAttribute('data-index') || '0');

        this.task = {
            title: title || '',
            completed
        };
        this.index = index;

        this.render();
    }

    render() {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                .todo-item {
                    display: flex;
                    align-items: center;
                    padding: 1rem 1.5rem;
                    background: #282828;
                    border-radius: 8px;
                    transition: all 0.2s ease;
                    border: 1px solid transparent;
                }
                .todo-item:hover {
                    background: #383838;
                    border-color: #404040;
                }
                .todo-text {
                    flex-grow: 1;
                    margin: 0 1rem;
                    font-size: 1rem;
                    color: #FFFFFF;
                    text-decoration: ${this.task.completed ? 'line-through' : 'none'};
                    opacity: ${this.task.completed ? '0.5' : '1'};
                    transition: all 0.2s ease;
                }
                .delete-btn {
                    padding: 0.5rem;
                    border: none;
                    border-radius: 500px;
                    cursor: pointer;
                    background: transparent;
                    color: #B3B3B3;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .delete-btn:hover {
                    background: #404040;
                    color: #FFFFFF;
                }
                .checkbox {
                    width: 20px;
                    height: 20px;
                    cursor: pointer;
                    accent-color: #1DB954;
                    border-radius: 50%;
                }
                .delete-icon {
                    width: 20px;
                    height: 20px;
                    stroke: currentColor;
                    stroke-width: 2;
                    fill: none;
                }
            </style>
            <div class="todo-item">
                <input type="checkbox" 
                       class="checkbox"
                       ${this.task.completed ? 'checked' : ''}>
                <span class="todo-text">${this.task.title}</span>
                <button class="delete-btn" title="Delete task">
                    <svg class="delete-icon" viewBox="0 0 24 24">
                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                </button>
            </div>
        `;

        // Add event listeners
        const checkbox = this.shadowRoot.querySelector('.checkbox');
        const deleteButton = this.shadowRoot.querySelector('.delete-btn');

        checkbox?.addEventListener('change', this.handleToggle.bind(this));
        deleteButton?.addEventListener('click', this.handleDelete.bind(this));
    }

    private handleToggle(event: Event) {
        const checkbox = event.target as HTMLInputElement;
        this.dispatchEvent(new CustomEvent('toggle', {
            detail: { index: this.index, completed: checkbox.checked }
        }));
    }

    private handleDelete() {
        this.dispatchEvent(new CustomEvent('delete', {
            detail: { index: this.index }
        }));
    }
}

customElements.define('todo-item', TodoItem); 