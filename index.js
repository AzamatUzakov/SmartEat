document.querySelectorAll('input[name="gender"]').forEach(genderRadio => {
    genderRadio.addEventListener('change', function() {
        if (this.value === 'female') {
            document.getElementById('pregnancyStatusContainer').style.display = 'block';
        } else {
            document.getElementById('pregnancyStatusContainer').style.display = 'none';
        }
    });
});

function calculateBJU() {
    const user_gender = document.querySelector('input[name="gender"]:checked')?.value;
    const user_height = parseFloat(document.getElementById('height').value);
    const user_weight = parseFloat(document.getElementById('weight').value);
    const user_age = parseFloat(document.getElementById('age').value);
    const user_target = document.getElementById('goal').value;
    const workout_week = parseInt(document.getElementById('workoutsPerWeek').value);
    const level_active = document.getElementById('activityLevel').value;
    const fitnessLevel = document.getElementById('fitnessLevel').value; // Уровень физической подготовки
    const pregnancyStatus = document.querySelector('#pregnancyStatus').value;

    if (!user_gender || isNaN(user_height) || isNaN(user_weight) || isNaN(user_age) || isNaN(workout_week)) {
        alert("Пожалуйста, заполните все поля корректно.");
        return;
    }

    let male_gens = document.querySelector('#male_hum');
    let level_p = document.querySelector('.level_p');
    let workout_p = document.querySelector('.workout_p');
    let target_p = document.querySelector('.target_p');
    let height_hum = document.querySelector('#height_hum');
    let weight_hum = document.querySelector('#weight_hum');
    let age_num = document.querySelector('#age_hum');

    let bmr;
    if (user_gender === 'male') {
        bmr = (10 * user_weight) + (6.25 * user_height) - (5 * user_age) + 5;
        male_gens.innerHTML = "<b>М</b><br> Пол";
    } else {
        bmr = (10 * user_weight) + (6.25 * user_height) - (5 * user_age) - 161;
        male_gens.innerHTML = "<b>Ж</b><br> Пол";
    }

    let activityFactor;
    switch (level_active) {
        case 'low':
            activityFactor = 1.2;
            level_p.innerHTML = "<b>Сидячая работа, малоподвижный образ жизни</b>";
            break;
        case 'medium':
            activityFactor = 1.55;
            level_p.innerHTML = "<b>Сидячая работа, среднеактивный образ жизни</b>";
            break;
        case 'high':
            activityFactor = 1.9;
            level_p.innerHTML = "<b>Работа связана с физической нагрузкой, очень активный образ жизни</b>";
            break;
        default:
            activityFactor = 1.2;
    }

    // Корректировка активности по уровню физической подготовки
    switch (fitnessLevel) {
        case 'beginner':
            activityFactor *= 1.0;
            break;
        case 'intermediate':
            activityFactor *= 1.1;
            break;
        case 'advanced':
            activityFactor *= 1.2;
            break;
        default:
            activityFactor *= 1.0;
    }

    // Корректировка по количеству тренировок
    if (workout_week >= 5) {
        activityFactor += 0.035 * workout_week; // 3.5% за тренировку
    } else if (workout_week >= 3) {
        activityFactor += 0.035 * workout_week; // 3.5% за тренировку
    }
    workout_p.innerHTML = `<b>${workout_week} тренировки в неделю</b>`;

    let pregnancyFactor = 0;
    if (user_gender === 'female') {
        switch (pregnancyStatus) {
            case 'pregnant':
                pregnancyFactor = 0.029 * workout_week;
                break;
            case 'breastfeeding_1_6':
                pregnancyFactor = 0.026 * workout_week;
                break;
            case 'breastfeeding_7_12':
                pregnancyFactor = 0.027 * workout_week;
                break;
            default:
                pregnancyFactor = 0;
        }
    }

    // Отладочная информация
    console.log(`Pregnancy Status: ${pregnancyStatus}`);
    console.log(`Pregnancy Factor: ${pregnancyFactor}`);

    const tdee = bmr * (activityFactor + pregnancyFactor);

    let targetCalories;
    switch (user_target) {
        case 'maintain':
            targetCalories = tdee;
            target_p.innerHTML = "<b>Поддерживать свою форму</b>";
            break;
        case 'lose':
            targetCalories = tdee - 500;
            target_p.innerHTML = "<b>Похудеть (убрать жир)</b>";
            break;
        case 'gain':
            targetCalories = tdee + 500;
            target_p.innerHTML = "<b>Набрать мышечную массу</b>";
            break;
        default:
            targetCalories = tdee;
    }

    height_hum.innerHTML = `<b>${user_height} см</b><br>Рост`;
    weight_hum.innerHTML = `<b>${user_weight} кг</b><br>Вес`;
    age_num.innerHTML = `<b>${user_age}</b><br>Возраст`;

    // Расчет БЖУ в граммах
    const targetProteinGrams = (targetCalories * 0.3) / 4;
    const targetFatGrams = (targetCalories * 0.25) / 9;
    const targetCarbGrams = (targetCalories * 0.45) / 4;

    // Расчет БЖУ на килограмм массы тела
    const proteinPerKg = (targetProteinGrams / user_weight).toFixed(2);
    const fatPerKg = (targetFatGrams / user_weight).toFixed(2);
    const carbsPerKg = (targetCarbGrams / user_weight).toFixed(2);

    // Отображение результатов
    document.getElementById('proteins').innerHTML = `<b>${targetProteinGrams.toFixed(0)}</b> <br> Белки`;
    document.getElementById('fats').innerHTML = `<b>${targetFatGrams.toFixed(0)}</b> <br> Жиры`;
    document.getElementById('carbs').innerHTML = `<b>${targetCarbGrams.toFixed(0)}</b> <br> Углеводы`;
    document.getElementById('calories').innerHTML = `<b>${targetCalories.toFixed(0)}</b> <br> Ккал`;

    document.getElementById('editProteinsPerKg').value = proteinPerKg;
    document.getElementById('editFatsPerKg').value = fatPerKg;
    document.getElementById('editCarbsPerKg').value = carbsPerKg;
    document.getElementById('editCalories').value = targetCalories.toFixed(0);

    document.getElementById('editProteinPercentage').value = 30;
    document.getElementById('editFatPercentage').value = 25;
    document.getElementById('editCarbPercentage').value = 45;
}

function showEditForm() {
    document.getElementById('editForm').style.display = 'block';
}

function updateMacrosBasedOnPercentages() {
    const weight = parseFloat(document.getElementById('weight').value);
    const editCalories = parseFloat(document.getElementById('editCalories').value);
    const editProteinPercentage = parseFloat(document.getElementById('editProteinPercentage').value) / 100;
    const editFatPercentage = parseFloat(document.getElementById('editFatPercentage').value) / 100;
    const editCarbPercentage = parseFloat(document.getElementById('editCarbPercentage').value) / 100;

    if (Math.abs(editProteinPercentage + editFatPercentage + editCarbPercentage - 1) > 0.01) {
        alert('Сумма процентов должна быть равна 100%');
        return;
    }

    const newProteinGrams = (editCalories * editProteinPercentage) / 4;
    const newFatGrams = (editCalories * editFatPercentage) / 9;
    const newCarbGrams = (editCalories * editCarbPercentage) / 4;

    // Пересчитайте значения на килограмм массы тела
    const proteinPerKg = (newProteinGrams / weight).toFixed(2);
    const fatPerKg = (newFatGrams / weight).toFixed(2);
    const carbsPerKg = (newCarbGrams / weight).toFixed(2);

    document.getElementById('editProteinsPerKg').value = proteinPerKg;
    document.getElementById('editFatsPerKg').value = fatPerKg;
    document.getElementById('editCarbsPerKg').value = carbsPerKg;
}

function saveEditedBJU() {
    const weight = parseFloat(document.getElementById('weight').value);
    const editProteinsPerKg = parseFloat(document.getElementById('editProteinsPerKg').value);
    const editFatsPerKg = parseFloat(document.getElementById('editFatsPerKg').value);
    const editCarbsPerKg = parseFloat(document.getElementById('editCarbsPerKg').value);
    const editCalories = parseFloat(document.getElementById('editCalories').value);

    const editProteins = editProteinsPerKg * weight;
    const editFats = editFatsPerKg * weight;
    const editCarbs = editCarbsPerKg * weight;

    const totalCalories = (editProteins * 4) + (editFats * 9) + (editCarbs * 4);

    document.getElementById('proteins').innerHTML = `<b>${editProteins.toFixed(0)}</b>  <br> Белки`;
    document.getElementById('fats').innerHTML = `<b>${editFats.toFixed(0)}</b> <br> Жиры`;
    document.getElementById('carbs').innerHTML = `<b>${editCarbs.toFixed(0)}</b>  <br> Углеводы`;
    document.getElementById('calories').innerHTML = `<b>${totalCalories.toFixed(0)}</b> <br> ккал`;
}

// Добавьте обработчики событий для ввода процентов и значений на кг массы тела
document.getElementById('editProteinPercentage').addEventListener('input', updateMacrosBasedOnPercentages);
document.getElementById('editFatPercentage').addEventListener('input', updateMacrosBasedOnPercentages);
document.getElementById('editCarbPercentage').addEventListener('input', updateMacrosBasedOnPercentages);
document.getElementById('editProteinsPerKg').addEventListener('input', saveEditedBJU);
document.getElementById('editFatsPerKg').addEventListener('input', saveEditedBJU);
document.getElementById('editCarbsPerKg').addEventListener('input', saveEditedBJU);

// Добавьте обработчики событий для кнопок расчета и сохранения
document.getElementById('calculateBtn').addEventListener('click', calculateBJU);
document.getElementById('saveBtn').addEventListener('click', saveEditedBJU);
