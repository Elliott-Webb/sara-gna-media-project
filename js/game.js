(function(){
  function normalizeItems(data){
    var out = [];
    if(!Array.isArray(data)) return out;
    data.forEach(function(item){
      if(!item || typeof item.src !== 'string') return;
      var isBool = (typeof item.correct === 'boolean');
      out.push({ src: item.src, correct: isBool ? item.correct : false });
    });
    return out;
  }

  var items = (typeof itemsData !== 'undefined' && itemsData && itemsData.length)
    ? normalizeItems(itemsData)
    : [];
  var statementText = (typeof quizStatement === 'string' && quizStatement.trim().length)
    ? quizStatement
    : 'Er eftirfarandi mynd sönn eða röng fyrir fullyrðinguna?';

  var index = 0;
  var score = 0;

  var statementEl = document.getElementById('statement');
  var imgEl = document.getElementById('prompt-img');
  var btnTrue = document.getElementById('btn-true');
  var btnFalse = document.getElementById('btn-false');
  var msg = document.getElementById('message');
  var skip = document.getElementById('skip');
  var viewAnswers = document.getElementById('view-answers');
  var scoreWrap = document.getElementById('score-wrap');
  var scoreEl = document.getElementById('score');
  var totalEl = document.getElementById('total');

  function render(){
    if(!items || items.length === 0){
      if(btnTrue) btnTrue.disabled = true;
      if(btnFalse) btnFalse.disabled = true;
      if(skip) skip.disabled = true;
      msg.textContent = 'No game data configured. Please define itemsData (with src/correct) and quizStatement.';
      return;
    }

    // end of list
    if(index >= items.length){
      if(btnTrue) btnTrue.disabled = true;
      if(btnFalse) btnFalse.disabled = true;
      if(skip){
        skip.disabled = false;
        skip.textContent = 'Endurræstu';
      }
      if(viewAnswers) viewAnswers.style.display = '';
      // reveal final score only now
      if(scoreWrap){
        scoreWrap.style.display = '';
      }
      if(scoreEl) scoreEl.textContent = String(score);
      if(totalEl) totalEl.textContent = String(items.length);
      msg.textContent = 'Prófinu lokið! Skoðaðu svörin eða byrjaðu aftur.';
      return;
    }

    var item = items[index];
    if(statementEl) statementEl.textContent = statementText;
    if(imgEl){
      imgEl.src = item.src;
      imgEl.alt = 'Prompt image ' + (index+1);
    }
    if(btnTrue) btnTrue.disabled = false;
    if(btnFalse) btnFalse.disabled = false;
    if(skip){
      skip.textContent = 'Næst';
      skip.disabled = false;
    }
    if(viewAnswers) viewAnswers.style.display = 'none';
    msg.textContent = '';
  }

  function answer(selected){
    if(index >= items.length) return;
    var item = items[index];
    var wasCorrect = (selected === item.correct);
    if(wasCorrect){
      score += 1;
    }
    // Show what the correct answer was for this item
    msg.textContent = 'Rétt svar: ' + (item.correct ? 'AI' : 'Alvöru');
    if(btnTrue) btnTrue.disabled = true;
    if(btnFalse) btnFalse.disabled = true;
    setTimeout(function(){ index += 1; render(); }, 700);
  }

  if(btnTrue){
    btnTrue.addEventListener('click', function(){ answer(true); });
  }
  if(btnFalse){
    btnFalse.addEventListener('click', function(){ answer(false); });
  }

  if(skip){
    skip.addEventListener('click', function(){
      if(index >= items.length){
        // restart
        index = 0;
        score = 0;
        if(scoreWrap) scoreWrap.style.display = 'none';
        if(viewAnswers) viewAnswers.style.display = 'none';
        msg.textContent = '';
        render();
        return;
      }
      index += 1;
      render();
    });
  }

  // Answers modal shows a simple list of correct answers
  (function(){
    var modal = document.getElementById('answers-modal');
    var closeBtn = document.getElementById('answers-close');
    var list = document.getElementById('answers-list');

    function openAnswers(){
      if(!items || items.length === 0) return;
      if(!modal || !list) return;
      // build list
      list.innerHTML = '';
      items.forEach(function(it, i){
        var container = document.createElement('div');
        var p = document.createElement('p');
        var img = document.createElement('img');
        img.style = 'max-height:100px;max-width:200px;';
        img.src = it.src;
        p.textContent = (i+1) + '. Rétt svar: ' + (it.correct ? 'AI' : 'Alvöru');
        container.appendChild(p);
        container.appendChild(img);
        list.appendChild(container)
      });
      modal.style.display = 'flex';
    }

    if(viewAnswers){
      viewAnswers.addEventListener('click', openAnswers);
    }
    if(closeBtn) closeBtn.addEventListener('click', function(){ if(modal) modal.style.display = 'none'; });
    if(modal) modal.addEventListener('click', function(e){ if(e.target === modal) modal.style.display = 'none'; });
  })();

  // Initial render
  render();
})();
