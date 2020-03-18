const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score',
      )
      .where('language.user_id', user_id)
      .first()
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .where({ language_id })
  },
  
  getNextHead(db, language_id) {
    return db
    .from('word')
    .select(
      'word.original as nextWord',
      'word.correct_count as wordCorrectCount',
      'word.incorrect_count as wordIncorrectCount',
      "language.total_score as totalScore",
    )
    .join("language", "word.language_id", '=', 'language.id' )
    .where({ language_id })
  },

  getAnswer(db, language_id) {
    return db
    .from('word')
    .select(
      'word.translation',
      'word.memory_value',
      'word.correct_count',
      'word.incorrect_count',
      'word.original',
      'language.total_score'
    )
    .join("language", "word.language_id", '=', 'language.id' )
    .where({ language_id })
  },

  compareToAnswer(guess, ans) {
    let guessLC = guess.toLowerCase()
    let newAns = ans
    
    if(guessLC === ans.translation){
      newAns.memory_value =newAns.memory_value * 2
      newAns.isCorrect=true
      ++newAns.correct_count
      ++newAns.total_score
      
    }
    else {
      newAns.memory_value = 1
      newAns.isCorrect=false
      ++newAns.incorrect_count
    }
    return newAns
  },

  updateWordScore(db,language_id, newAns){
    return
    db("word")
    .where({original:newAns.original,
      language_id
    })
    .update({
    memory_value:newAns.memory_value,
    correct_count:newAns.correct_count,
    incorrect_count:newAns.incorrect_count
    

  })
  
  
  
 
    
  },
  updateLanguageScore(db,language_id, newAns){
    db("language")
    .where({id:language_id})
   .update({
    total_score:newAns.total_score
    })
  }


}

module.exports = LanguageService
