import asyncio
import logging
from typing import Dict, Any

# Dictionary to store tasks with their IDs
tasks: Dict[int, asyncio.Task] = {}

last_task_id: int = 0


def schedule_task(function: Any, *args: Any, **kwargs: Any):
    """Schedule an async task and store it in the tasks dictionary."""
    global last_task_id
    last_task_id += 1
    # Create an asyncio task for do_work function
    task = asyncio.create_task(function(last_task_id, *args, **kwargs))
    # Store the task with its ID
    tasks[last_task_id] = task
    
    return last_task_id
    
def get_task_status(task_id: int) -> str:
    """Check the status of a task by its ID and return the result or status."""
    logging.info(f"Checking status of task {task_id}")
    task = tasks.get(task_id)
    if task is None:
        raise ValueError("Task not found.")
    if task.done():
        # If the task is done, delete it and return its result
        result = tasks.pop(task_id).result()
        return result
    else:
        return None