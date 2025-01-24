document.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("userId");
  const baseUrl = "https://fitness-app-blib.onrender.com";

  if (!userId) {
    alert("User not logged in!");
    window.location.href = "/login.html";
    return;
  }
  const addWorkoutModal = document.getElementById("addWorkoutModal");
  const addGoalModal = document.getElementById("addGoalModal");
  const addWorkoutBtn = document.getElementById("addWorkoutBtn");
  const addGoalBtn = document.getElementById("addGoalBtn");
  const closeWorkoutModal = document.getElementById("closeWorkoutModal");
  const closeGoalModal = document.getElementById("closeGoalModal");
  addWorkoutBtn.addEventListener(
    "click",
    () => (addWorkoutModal.style.display = "block")
  );
  addGoalBtn.addEventListener(
    "click",
    () => (addGoalModal.style.display = "block")
  );
  closeWorkoutModal.addEventListener(
    "click",
    () => (addWorkoutModal.style.display = "none")
  );
  closeGoalModal.addEventListener(
    "click",
    () => (addGoalModal.style.display = "none")
  );
  window.addEventListener("click", (event) => {
    if (event.target === addWorkoutModal)
      addWorkoutModal.style.display = "none";
    if (event.target === addGoalModal) addGoalModal.style.display = "none";
  });

  document
    .getElementById("workoutForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const exerciseType = document.getElementById("exerciseType").value;
      const duration = document.getElementById("duration").value;
      const caloriesBurned = document.getElementById("caloriesBurned").value;
      const distanceTraveled =
        document.getElementById("distanceTraveled").value;
      try {
        const response = await fetch(`${baseUrl}/api/workouts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            exerciseType,
            duration,
            caloriesBurned,
            distanceTraveled,
          }),
        });
        if (response.ok) {
          alert("Workout added successfully!");
          addWorkoutModal.style.display = "none";
          updateTable();
        } else {
          const error = await response.json();
          alert("Error adding workout: " + error.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });
  document
    .getElementById("goalForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const goalType = document.getElementById("goalType").value;
      const targetValue = document.getElementById("targetValue").value;
      const currentValue = document.getElementById("currentValue").value;
      const endDate = document.getElementById("endDate").value;
      try {
        const response = await fetch(`${baseUrl}/api/goals`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            goalType,
            targetValue,
            currentValue,
            endDate,
          }),
        });
        if (response.ok) {
          alert("Goal added successfully!");
          addGoalModal.style.display = "none";
          updateTable();
        } else {
          const error = await response.json();
          alert("Error adding goal: " + error.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });

  const renderTable = async (tableId, apiUrl, createRow) => {
    const tableBody = document.querySelector(`${tableId} tbody`);
    tableBody.innerHTML = "";
    const response = await fetch(`${baseUrl}${apiUrl}?userId=${userId}`);
    const data = await response.json();
    data.forEach((item) => tableBody.appendChild(createRow(item)));
  };

  const deleteItem = async (apiUrl, id, refresh) => {
    await fetch(`${baseUrl}${apiUrl}/${id}`, { method: "DELETE" });
    refresh();
  };

  const updateTable = () => {
    renderTable("#workoutsTable", "/api/workouts", (workout) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${new Date(workout.dateOfWorkout).toLocaleDateString()}</td>
          <td>${workout.exerciseType}</td>
          <td>${workout.duration}</td>
          <td>${workout.caloriesBurned}</td>
          <td>${workout.distanceTraveled || "-"}</td>
          <td>
            <button data-id="${
              workout._id
            }" class="editWorkoutBtn">Edit</button>
            <button data-id="${
              workout._id
            }" class="deleteWorkoutBtn">Delete</button>
          </td>
        `;
      row.querySelector(".deleteWorkoutBtn").addEventListener("click", () => {
        deleteItem("/api/workouts", workout._id, updateTable);
      });
      row.querySelector(".editWorkoutBtn").addEventListener("click", () => {
        openEditModal(workout);
      });
      return row;
    });

    renderTable("#goalsTable", "/api/goals", (goal) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${goal.goalType}</td>
        <td>${goal.targetValue}</td>
        <td>${goal.currentValue}</td>
        <td>${new Date(goal.startDate).toLocaleDateString()}</td>
        <td>${new Date(goal.endDate).toLocaleDateString()}</td>
        <td>
          <button data-id="${goal._id}" class="editGoalBtn">Edit</button>
          <button data-id="${goal._id}" class="deleteGoalBtn">Delete</button>
        </td>
      `;
      row.querySelector(".deleteGoalBtn").addEventListener("click", () => {
        deleteItem("/api/goals", goal._id, updateTable);
      });
      row.querySelector(".editGoalBtn").addEventListener("click", () => {
        openEditGoalModal(goal);
      });
      return row;
    });
  };

  updateTable();
  function openEditModal(workout) {
    const modal = document.getElementById("editWorkoutModal");
    modal.style.display = "block";
    document.getElementById("editExerciseType").value = workout.exerciseType;
    document.getElementById("editDuration").value = workout.duration;
    document.getElementById("editCaloriesBurned").value =
      workout.caloriesBurned;
    document.getElementById("editDistanceTraveled").value =
      workout.distanceTraveled || "";
    const editForm = document.getElementById("editWorkoutForm");
    editForm.onsubmit = async (event) => {
      event.preventDefault();
      const updatedWorkout = {
        exerciseType: document.getElementById("editExerciseType").value,
        duration: document.getElementById("editDuration").value,
        caloriesBurned: document.getElementById("editCaloriesBurned").value,
        distanceTraveled:
          document.getElementById("editDistanceTraveled").value || null,
      };
      await fetch(`${baseUrl}/api/workouts/${workout._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedWorkout),
      });
      modal.style.display = "none";
      updateTable();
    };
  }

  function openEditGoalModal(goal) {
    const modal = document.getElementById("editGoalModal");
    modal.style.display = "block";
    document.getElementById("editGoalType").value = goal.goalType;
    document.getElementById("editTargetValue").value = goal.targetValue;
    document.getElementById("editCurrentValue").value = goal.currentValue || 0;
    document.getElementById("editEndDate").value = goal.endDate.split("T")[0]; // Formatting date
    const editForm = document.getElementById("editGoalForm");
    editForm.onsubmit = async (event) => {
      event.preventDefault();
      const updatedGoal = {
        goalType: document.getElementById("editGoalType").value,
        targetValue: document.getElementById("editTargetValue").value,
        currentValue: document.getElementById("editCurrentValue").value || 0,
        endDate: document.getElementById("editEndDate").value,
      };
      await fetch(`${baseUrl}/api/goals/${goal._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedGoal),
      });
      modal.style.display = "none";
      updateTable();
    };
  }
  document
    .getElementById("closeEditWorkoutModal")
    .addEventListener("click", () => {
      document.getElementById("editWorkoutModal").style.display = "none";
    });
  document
    .getElementById("closeEditGoalModal")
    .addEventListener("click", () => {
      document.getElementById("editGoalModal").style.display = "none";
    });
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("userId");
    window.location.href = "/index.html";
  });
});
