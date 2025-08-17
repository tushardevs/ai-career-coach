import google.generativeai as genai
from google.generativeai import GenerativeModel
import nest_asyncio
import asyncio
import json
from datetime import datetime
import threading
import queue

# Apply nest_asyncio for compatibility
nest_asyncio.apply()

# Configure Gemini
GOOGLE_API_KEY = "AIzaSyBWKn6p54rbk-BsmQVLHPA6mwqjG5u81Kg"
genai.configure(api_key=GOOGLE_API_KEY)

# Initialize model
gen_ai = GenerativeModel("gemini-1.5-flash")

class VoiceInterviewSystem:
  def __init__(self):
    self.user_data = {}
    self.questions = []
    self.answers = []
    self.evaluations = []
    self.chat_mode = "text" # Default to text mode
    
    # Voice-related components - will be initialized only if needed
    self.recognizer = None
    self.microphone = None
    self.tts_engine = None
    
  def init_voice_components(self):
    """Initialize voice components only when needed"""
    try:
      import speech_recognition as sr
      import pyttsx3
      
      self.recognizer = sr.Recognizer()
      self.microphone = sr.Microphone()
      self.tts_engine = pyttsx3.init()
      self.setup_tts()
      return True
    except Exception as e:
      print(f" Failed to initialize voice components: {e}")
      print(" Falling back to text mode...")
      self.chat_mode = "text"
      return False
    
  def setup_tts(self):
    """Configure text-to-speech settings"""
    if self.tts_engine:
      try:
        voices = self.tts_engine.getProperty('voices')
        if voices:
          self.tts_engine.setProperty('voice', voices[0].id)
        self.tts_engine.setProperty('rate', 150)
        self.tts_engine.setProperty('volume', 0.9)
      except Exception as e:
        print(f" TTS setup warning: {e}")

  def choose_chat_mode(self):
    """Let user choose between voice and text chat"""
    print("\n AI Interview System - Mode Selection")
    print("=" * 50)
    print("Please choose your preferred interaction mode:")
    print("1. Voice Chat (speak and listen)")
    print("2. Text Chat (type and read)")
    print("=" * 50)
    
    while True:
      try:
        choice = input("Enter your choice (1 for Voice, 2 for Text): ").strip()
        if choice == "1":
          print(" Initializing voice components...")
          if self.init_voice_components():
            self.chat_mode = "voice"
            print(" Voice chat mode selected and initialized!")
            return "voice"
          else:
            print(" Voice initialization failed. Please choose text mode.")
            continue
        elif choice == "2":
          self.chat_mode = "text"
          print(" Text chat mode selected!")
          return "text"
        else:
          print(" Invalid choice. Please enter 1 or 2.")
      except KeyboardInterrupt:
        print("\n Goodbye!")
        return None

  def speak(self, text):
    """Convert text to speech or print based on mode"""
    print(f" Assistant: {text}")
    if self.chat_mode == "voice" and self.tts_engine:
      try:
        self.tts_engine.say(text)
        self.tts_engine.runAndWait()
      except Exception as e:
        print(f" Text-to-speech error: {e}")
        print(" Continuing with text output...")

  def get_text_input(self, prompt="Your response: "):
    """Get text input from user"""
    try:
      response = input(f" {prompt}").strip()
      print(f" You said: {response}")
      return response
    except KeyboardInterrupt:
      print("\n Interview cancelled by user.")
      return ""

  def listen(self, timeout=10, phrase_time_limit=30):
    """Get user input based on selected mode"""
    if self.chat_mode == "text":
      return self.get_text_input()
    
    # Voice mode
    if not self.recognizer or not self.microphone:
      print(" Voice components not initialized. Falling back to text input.")
      return self.get_text_input()
      
    try:
      import speech_recognition as sr
      
      with self.microphone as source:
        print(" Listening... Speak now!")
        self.recognizer.adjust_for_ambient_noise(source, duration=1)
        audio = self.recognizer.listen(source, timeout=timeout, phrase_time_limit=phrase_time_limit)
        
      print(" Processing speech...")
      text = self.recognizer.recognize_google(audio)
      print(f" You said: {text}")
      return text
      
    except sr.WaitTimeoutError:
      self.speak("I didn't hear anything. Let's continue.")
      return ""
    except sr.UnknownValueError:
      self.speak("Sorry, I couldn't understand what you said. Could you please repeat?")
      return ""
    except sr.RequestError as e:
      self.speak("Sorry, there was an error with the speech recognition service.")
      print(f"Error: {e}")
      return ""
    except Exception as e:
      print(f" Voice recognition error: {e}")
      print(" Falling back to text input...")
      return self.get_text_input()

  async def phase_1_greeting(self):
    """Phase 1: Greet the candidate"""
    greeting = """
    Hello! Welcome to your AI-powered technical interview. I'm your virtual interviewer today.
    This interview will consist of several phases:
    First, I'll ask about your background and experience.
    Then, I'll ask you three technical questions based on your expertise.
    Finally, I'll provide you with a detailed evaluation report.
    
    Are you ready to begin?
    """
    self.speak(greeting)
    
    response = self.listen(timeout=15)
    if response.lower() in ['yes', 'yeah', 'ready', 'sure', 'ok', 'okay']:
      self.speak("Great! Let's start with your introduction.")
      return True
    else:
      self.speak("Take your time. Let me know when you're ready!")
      return await self.phase_1_greeting()

  async def phase_2_introduction(self):
    """Phase 2: Collect user background information"""
    self.speak("Please tell me about your current role, your responsibilities, and the technology stack you work with. Take your time.")
    
    intro_response = self.listen(timeout=20, phrase_time_limit=60)
    if not intro_response:
      self.speak("Let me ask you some specific questions to understand your background better.")
      
      self.speak("What is your current job title or the role you're applying for?")
      role = self.listen(timeout=15)
      
      self.speak("What are your main responsibilities in this role?")
      responsibilities = self.listen(timeout=20, phrase_time_limit=45)
      
      self.speak("What technologies, programming languages, or frameworks do you primarily work with?")
      tech_stack = self.listen(timeout=20, phrase_time_limit=45)
      
      intro_response = f"Role: {role}. Responsibilities: {responsibilities}. Technology Stack: {tech_stack}"
    
    self.user_data['introduction'] = intro_response
    self.user_data['timestamp'] = datetime.now().isoformat()
    
    self.speak("Thank you for that introduction. Now I'll generate some technical questions based on your background.")
    return intro_response

  async def generate_questions_based_on_intro(self, intro_text):
    """Generate questions based on user's introduction"""
    prompt = f"""
    Based on this candidate's introduction, generate exactly 3 progressive technical interview questions.
    Make them increasingly challenging and specific to their mentioned skills.
    
    Candidate Introduction: {intro_text}
    
    Format your response as a JSON array with objects containing 'question' and 'difficulty_level':
    [
      {{"question": "question text", "difficulty_level": "beginner"}},
      {{"question": "question text", "difficulty_level": "intermediate"}},
      {{"question": "question text", "difficulty_level": "advanced"}}
    ]
    """
    
    try:
      response = await gen_ai.generate_content_async(prompt)
      questions_text = response.text.strip()
      
      # Extract JSON from response
      start_idx = questions_text.find('[')
      end_idx = questions_text.rfind(']') + 1
      json_str = questions_text[start_idx:end_idx]
      
      questions_data = json.loads(json_str)
      self.questions = questions_data
      return questions_data
      
    except Exception as e:
      print(f"Error generating questions: {e}")
      # Fallback questions
      self.questions = [
        {"question": "Can you explain the difference between abstract classes and interfaces in your programming language?", "difficulty_level": "beginner"},
        {"question": "How would you optimize a slow-running database query?", "difficulty_level": "intermediate"},
        {"question": "Design a scalable system architecture for handling millions of concurrent users.", "difficulty_level": "advanced"}
      ]
      return self.questions

  async def phase_3_technical_questions(self):
    """Phase 3: Ask technical questions and collect answers"""
    self.speak("Now I'll ask you three technical questions. Please take your time to think and provide detailed answers.")
    
    for i, q_data in enumerate(self.questions, 1):
      question = q_data['question']
      difficulty = q_data['difficulty_level']
      
      self.speak(f"Question {i} - {difficulty.capitalize()} level: {question}")
      
      answer = self.listen(timeout=30, phrase_time_limit=120)
      
      if not answer:
        self.speak("Would you like me to repeat the question?")
        repeat_response = self.listen(timeout=10)
        if 'yes' in repeat_response.lower():
          self.speak(question)
          answer = self.listen(timeout=30, phrase_time_limit=120)
      
      self.answers.append({
        'question_number': i,
        'question': question,
        'difficulty_level': difficulty,
        'answer': answer,
        'timestamp': datetime.now().isoformat()
      })
      
      # Provide brief acknowledgment
      self.speak("Thank you for your answer. Let me move to the next question.")
    
    self.speak("Great! You've answered all the technical questions. Now I'll evaluate your responses and prepare your report.")

  async def evaluate_answers(self):
    """Evaluate each answer using Gemini AI with detailed analysis"""
    for i, answer_data in enumerate(self.answers):
      prompt = f"""
      Evaluate this technical interview answer comprehensively and provide detailed feedback:
      
      Question ({answer_data['difficulty_level']} level): {answer_data['question']}
      Answer: {answer_data['answer']}
      Candidate Background: {self.user_data.get('introduction', '')}
      
      Please provide detailed analysis in JSON format:
      {{
        "score": 8,
        "technical_depth": 7,
        "communication_clarity": 6,
        "problem_solving_approach": 8,
        "industry_knowledge": 7,
        "strengths": ["specific strength 1", "specific strength 2"],
        "weaknesses": ["specific weakness 1", "specific weakness 2"],
        "technical_gaps": ["gap 1", "gap 2"],
        "improvements": ["improvement area 1", "improvement area 2"],
        "suggestions": ["actionable suggestion 1", "actionable suggestion 2"],
        "confidence_level": "high/medium/low",
        "answer_completeness": "complete/partial/incomplete",
        "demonstrates_experience": true,
        "red_flags": ["concern 1", "concern 2"]
      }}
      """
      
      try:
        response = await gen_ai.generate_content_async(prompt)
        evaluation_text = response.text.strip()
        
        # Extract JSON from response
        start_idx = evaluation_text.find('{')
        end_idx = evaluation_text.rfind('}') + 1
        json_str = evaluation_text[start_idx:end_idx]
        
        evaluation = json.loads(json_str)
        evaluation['question_number'] = i + 1
        evaluation['question_text'] = answer_data['question']
        evaluation['difficulty_level'] = answer_data['difficulty_level']
        self.evaluations.append(evaluation)
        
      except Exception as e:
        print(f"Error evaluating answer {i+1}: {e}")
        # Enhanced fallback evaluation
        self.evaluations.append({
          "question_number": i + 1,
          "question_text": answer_data['question'],
          "difficulty_level": answer_data['difficulty_level'],
          "score": 5,
          "technical_depth": 4,
          "communication_clarity": 5,
          "problem_solving_approach": 4,
          "industry_knowledge": 4,
          "strengths": ["Attempted to answer"],
          "weaknesses": ["Limited technical detail"],
          "technical_gaps": ["Needs more depth"],
          "improvements": ["Practice technical explanations"],
          "suggestions": ["Study core concepts"],
          "confidence_level": "low",
          "answer_completeness": "incomplete",
          "demonstrates_experience": False,
          "red_flags": ["Evaluation system error"]
        })

  async def analyze_tech_stack_proficiency(self):
    """Analyze candidate's proficiency in different technology stacks"""
    intro_text = self.user_data.get('introduction', '')
    
    prompt = f"""
    Based on the candidate's introduction and interview performance, analyze their proficiency in different technology areas.
    
    Candidate Introduction: {intro_text}
    Interview Questions and Answers: {json.dumps([{'question': ans['question'], 'answer': ans['answer'], 'score': eval_data.get('score', 0)} for ans, eval_data in zip(self.answers, self.evaluations)], indent=2)}
    
    Provide a comprehensive tech stack analysis in JSON format:
    {{
      "programming_languages": {{
        "java": {{"proficiency": "expert/intermediate/beginner/unknown", "confidence": 85, "evidence": ["specific evidence"], "gaps": ["gap 1"]}},
        "python": {{"proficiency": "expert/intermediate/beginner/unknown", "confidence": 70, "evidence": ["evidence"], "gaps": ["gaps"]}},
        "javascript": {{"proficiency": "expert/intermediate/beginner/unknown", "confidence": 60, "evidence": ["evidence"], "gaps": ["gaps"]}}
      }},
      "frameworks_libraries": {{
        "spring_boot": {{"proficiency": "expert/intermediate/beginner/unknown", "confidence": 80, "evidence": ["evidence"], "gaps": ["gaps"]}},
        "react": {{"proficiency": "expert/intermediate/beginner/unknown", "confidence": 0, "evidence": [], "gaps": ["not mentioned"]}}
      }},
      "databases": {{
        "postgresql": {{"proficiency": "expert/intermediate/beginner/unknown", "confidence": 75, "evidence": ["evidence"], "gaps": ["gaps"]}},
        "mongodb": {{"proficiency": "expert/intermediate/beginner/unknown", "confidence": 70, "evidence": ["evidence"], "gaps": ["gaps"]}},
        "elasticsearch": {{"proficiency": "expert/intermediate/beginner/unknown", "confidence": 60, "evidence": ["evidence"], "gaps": ["gaps"]}}
      }},
      "cloud_devops": {{
        "aws": {{"proficiency": "expert/intermediate/beginner/unknown", "confidence": 40, "evidence": ["evidence"], "gaps": ["gaps"]}},
        "docker": {{"proficiency": "expert/intermediate/beginner/unknown", "confidence": 30, "evidence": ["evidence"], "gaps": ["gaps"]}},
        "kubernetes": {{"proficiency": "expert/intermediate/beginner/unknown", "confidence": 20, "evidence": ["evidence"], "gaps": ["gaps"]}}
      }},
      "system_design": {{
        "scalability": {{"proficiency": "expert/intermediate/beginner/unknown", "confidence": 50, "evidence": ["evidence"], "gaps": ["gaps"]}},
        "microservices": {{"proficiency": "expert/intermediate/beginner/unknown", "confidence": 60, "evidence": ["evidence"], "gaps": ["gaps"]}},
        "caching": {{"proficiency": "expert/intermediate/beginner/unknown", "confidence": 70, "evidence": ["evidence"], "gaps": ["gaps"]}}
      }},
      "overall_assessment": {{
        "strongest_areas": ["area 1", "area 2"],
        "weakest_areas": ["area 1", "area 2"],
        "skill_level": "senior/mid/junior/entry",
        "technical_credibility": "high/medium/low",
        "areas_of_concern": ["concern 1", "concern 2"]
      }}
    }}
    """
    
    try:
      response = await gen_ai.generate_content_async(prompt)
      analysis_text = response.text.strip()
      
      # Extract JSON from response
      start_idx = analysis_text.find('{')
      end_idx = analysis_text.rfind('}') + 1
      json_str = analysis_text[start_idx:end_idx]
      
      return json.loads(json_str)
      
    except Exception as e:
      print(f"Error analyzing tech stack: {e}")
      # Fallback analysis
      return {
        "programming_languages": {"java": {"proficiency": "unknown", "confidence": 0, "evidence": [], "gaps": ["Analysis failed"]}},
        "frameworks_libraries": {"spring_boot": {"proficiency": "unknown", "confidence": 0, "evidence": [], "gaps": ["Analysis failed"]}},
        "databases": {},
        "cloud_devops": {},
        "system_design": {},
        "overall_assessment": {
          "strongest_areas": ["Unable to determine"],
          "weakest_areas": ["Analysis failed"],
          "skill_level": "unknown",
          "technical_credibility": "unknown",
          "areas_of_concern": ["Technical analysis failed"]
        }
      }

  async def generate_hiring_recommendation(self, tech_analysis, average_score):
    """Generate detailed hiring recommendation for interviewer"""
    prompt = f"""
    Generate a comprehensive hiring recommendation based on this interview data:
    
    Average Interview Score: {average_score}/10
    Tech Stack Analysis: {json.dumps(tech_analysis, indent=2)}
    Individual Question Performance: {json.dumps([{'question': eval_data.get('question_text', ''), 'score': eval_data.get('score', 0), 'difficulty': eval_data.get('difficulty_level', '')} for eval_data in self.evaluations], indent=2)}
    
    Provide detailed recommendation in JSON format:
    {{
      "hiring_decision": "strong_hire/hire/no_hire/strong_no_hire",
      "confidence_level": "high/medium/low",
      "role_suitability": {{
        "senior_engineer": "excellent/good/poor/unsuitable",
        "mid_level_engineer": "excellent/good/poor/unsuitable",
        "junior_engineer": "excellent/good/poor/unsuitable",
        "team_lead": "excellent/good/poor/unsuitable"
      }},
      "key_strengths": ["strength 1", "strength 2", "strength 3"],
      "critical_concerns": ["concern 1", "concern 2"],
      "technical_readiness": {{
        "current_level": "senior/mid/junior/entry",
        "ready_for_role": true,
        "gap_analysis": ["gap 1", "gap 2"],
        "onboarding_effort": "low/medium/high"
      }},
      "interview_performance": {{
        "communication": "excellent/good/average/poor",
        "problem_solving": "excellent/good/average/poor",
        "technical_depth": "excellent/good/average/poor",
        "cultural_fit_indicators": ["indicator 1", "indicator 2"]
      }},
      "next_steps": {{
        "recommended_action": "hire/reject/second_interview/technical_deep_dive",
        "additional_interviews_needed": ["system_design", "behavioral"],
        "focus_areas_for_next_round": ["area 1", "area 2"]
      }},
      "salary_band_recommendation": "above_average/average/below_average",
      "probation_recommendations": ["recommendation 1", "recommendation 2"],
      "team_placement_suggestions": ["suggestion 1", "suggestion 2"]
    }}
    """
    
    try:
      response = await gen_ai.generate_content_async(prompt)
      recommendation_text = response.text.strip()
      
      # Extract JSON from response
      start_idx = recommendation_text.find('{')
      end_idx = recommendation_text.rfind('}') + 1
      json_str = recommendation_text[start_idx:end_idx]
      
      return json.loads(json_str)
      
    except Exception as e:
      print(f"Error generating hiring recommendation: {e}")
      # Fallback recommendation
      return {
        "hiring_decision": "no_hire" if average_score < 6 else "hire",
        "confidence_level": "low",
        "key_strengths": ["Unable to determine"],
        "critical_concerns": ["Analysis failed"],
        "next_steps": {"recommended_action": "manual_review"},
        "technical_readiness": {"current_level": "unknown", "ready_for_role": False}
      }

  async def phase_4_generate_report(self):
    """Phase 4: Generate comprehensive report with detailed analysis"""
    await self.evaluate_answers()
    
    # Calculate overall performance metrics
    total_score = sum(eval_data.get('score', 0) for eval_data in self.evaluations)
    average_score = total_score / len(self.evaluations) if self.evaluations else 0
    
    # Calculate additional metrics
    technical_depth_avg = sum(eval_data.get('technical_depth', 0) for eval_data in self.evaluations) / len(self.evaluations) if self.evaluations else 0
    communication_avg = sum(eval_data.get('communication_clarity', 0) for eval_data in self.evaluations) / len(self.evaluations) if self.evaluations else 0
    problem_solving_avg = sum(eval_data.get('problem_solving_approach', 0) for eval_data in self.evaluations) / len(self.evaluations) if self.evaluations else 0
    
    # Generate tech stack analysis
    tech_analysis = await self.analyze_tech_stack_proficiency()
    
    # Generate hiring recommendation
    hiring_recommendation = await self.generate_hiring_recommendation(tech_analysis, average_score)
    
    # Generate interview summary for quick review
    interview_summary = {
      "candidate_name": "Interview Candidate",
      "interview_duration": "Approximately 30-45 minutes",
      "mode_used": self.chat_mode,
      "quick_verdict": hiring_recommendation.get('hiring_decision', 'no_hire'),
      "primary_concerns": hiring_recommendation.get('critical_concerns', []),
      "standout_strengths": hiring_recommendation.get('key_strengths', []),
      "recommended_next_steps": hiring_recommendation.get('next_steps', {}).get('recommended_action', 'manual_review')
    }
    
    # Compile comprehensive report for interviewer
    report = {
      'interview_metadata': {
        'interview_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'interview_mode': self.chat_mode,
        'questions_asked': len(self.questions),
        'completion_status': 'completed'
      },
      
      'candidate_profile': {
        'background': self.user_data.get('introduction', ''),
        'claimed_experience': self.extract_experience_claims(),
        'timestamp': self.user_data.get('timestamp', '')
      },
      
      'interview_summary': interview_summary,
      
      'performance_metrics': {
        'overall_score': round(average_score, 1),
        'technical_depth_score': round(technical_depth_avg, 1),
        'communication_score': round(communication_avg, 1),
        'problem_solving_score': round(problem_solving_avg, 1),
        'score_distribution': {
          'beginner_questions': [e.get('score', 0) for e in self.evaluations if e.get('difficulty_level') == 'beginner'],
          'intermediate_questions': [e.get('score', 0) for e in self.evaluations if e.get('difficulty_level') == 'intermediate'],
          'advanced_questions': [e.get('score', 0) for e in self.evaluations if e.get('difficulty_level') == 'advanced']
        }
      },
      
      'detailed_question_analysis': self.evaluations,
      
      'tech_stack_proficiency': tech_analysis,
      
      'hiring_recommendation': hiring_recommendation,
      
      'interviewer_notes': {
        'red_flags': self.compile_red_flags(),
        'positive_indicators': self.compile_positive_indicators(),
        'verification_needed': self.identify_claims_to_verify(),
        'follow_up_questions': self.generate_follow_up_questions()
      },
      
      'questions_and_answers_detailed': self.answers,
      
      'actionable_insights': {
        'immediate_decision': hiring_recommendation.get('hiring_decision', 'no_hire'),
        'confidence_in_decision': hiring_recommendation.get('confidence_level', 'low'),
        'if_hired_recommendations': hiring_recommendation.get('probation_recommendations', []),
        'if_rejected_feedback': self.generate_rejection_feedback()
      }
    }
    
    # Save comprehensive report
    with open('interview_report.json', 'w') as f:
      json.dump(report, f, indent=2)
    
    # Save interviewer summary (quick reference)
    interviewer_summary = {
      'candidate_summary': interview_summary,
      'key_metrics': report['performance_metrics'],
      'decision_recommendation': hiring_recommendation,
      'next_steps': hiring_recommendation.get('next_steps', {})
    }
    
    with open('interviewer_summary.json', 'w') as f:
      json.dump(interviewer_summary, f, indent=2)
    
    # Deliver verbal report to candidate
    self.speak("Your interview is now complete! Here's your performance summary:")
    self.speak(f"Overall Score: {average_score:.1f} out of 10")
    
    for i, evaluation in enumerate(self.evaluations, 1):
      score = evaluation.get('score', 0)
      self.speak(f"Question {i} Score: {score} out of 10")
      if evaluation.get('strengths'):
        strengths = evaluation.get('strengths', [])[:2]
        self.speak(f"Strengths: {', '.join(strengths)}")
    
    self.speak("A detailed written report has been saved for the interviewer's reference.")
    self.speak("Thank you for participating in this AI-powered interview!")
    
    return report
  
  def extract_experience_claims(self):
    """Extract key experience claims from candidate introduction"""
    intro = self.user_data.get('introduction', '')
    return {
      'years_of_experience': self.extract_years_mentioned(intro),
      'companies_mentioned': self.extract_companies(intro),
      'technologies_claimed': self.extract_technologies(intro),
      'achievements_claimed': self.extract_achievements(intro)
    }
  
  def extract_years_mentioned(self, text):
    """Extract years of experience mentioned"""
    import re
    years_pattern = r'(\d+)\s*years?'
    matches = re.findall(years_pattern, text.lower())
    return [int(match) for match in matches] if matches else []
  
  def extract_companies(self, text):
    """Extract company names mentioned"""
    common_companies = ['google', 'microsoft', 'amazon', 'apple', 'meta', 'netflix', 'uber', 'airbnb']
    mentioned = [company for company in common_companies if company.lower() in text.lower()]
    return mentioned
  
  def extract_technologies(self, text):
    """Extract technologies mentioned"""
    tech_keywords = ['java', 'python', 'spring boot', 'elasticsearch', 'postgresql', 'mongodb', 'kafka', 'redis', 'docker', 'kubernetes', 'aws', 'react', 'angular']
    mentioned = [tech for tech in tech_keywords if tech.lower() in text.lower()]
    return mentioned
  
  def extract_achievements(self, text):
    """Extract achievement claims"""
    achievement_indicators = ['optimiz', 'improv', 'achiev', 'reduc', 'increas', 'built', 'designed', 'implement']
    achievements = []
    sentences = text.split('.')
    for sentence in sentences:
      if any(indicator in sentence.lower() for indicator in achievement_indicators):
        achievements.append(sentence.strip())
    return achievements
  
  def compile_red_flags(self):
    """Compile red flags from the interview"""
    red_flags = []
    for eval_data in self.evaluations:
      red_flags.extend(eval_data.get('red_flags', []))
    
    # Add overall red flags
    total_score = sum(eval_data.get('score', 0) for eval_data in self.evaluations)
    if total_score < 15: # Very low total score
      red_flags.append("Extremely poor interview performance across all questions")
    
    confidence_levels = [eval_data.get('confidence_level', 'low') for eval_data in self.evaluations]
    if confidence_levels.count('low') >= 2:
      red_flags.append("Consistently low confidence in technical responses")
    
    return list(set(red_flags)) # Remove duplicates
  
  def compile_positive_indicators(self):
    """Compile positive indicators from the interview"""
    positives = []
    for eval_data in self.evaluations:
      positives.extend(eval_data.get('strengths', []))
    
    # Add experience indicators if mentioned in intro
    if 'google' in self.user_data.get('introduction', '').lower():
      positives.append("Claims experience at major tech company")
    
    return list(set(positives)) # Remove duplicates
  
  def identify_claims_to_verify(self):
    """Identify claims that need verification"""
    claims_to_verify = []
    intro = self.user_data.get('introduction', '')
    
    if 'google' in intro.lower():
      claims_to_verify.append("Verify Google employment and role")
    
    if '80%' in intro or 'optimization' in intro.lower():
      claims_to_verify.append("Verify performance optimization achievements")
    
    if 'senior' in intro.lower():
      claims_to_verify.append("Verify seniority level matches demonstrated skills")
    
    return claims_to_verify
  
  def generate_follow_up_questions(self):
    """Generate follow-up questions for deeper assessment"""
    follow_ups = []
    
    for eval_data in self.evaluations:
      if eval_data.get('score', 0) < 5:
        follow_ups.append(f"Deep dive into {eval_data.get('difficulty_level', 'technical')} concepts")
    
    follow_ups.append("System design round to assess architecture skills")
    follow_ups.append("Behavioral interview to assess cultural fit")
    
    return follow_ups
  
  def generate_rejection_feedback(self):
    """Generate constructive rejection feedback"""
    feedback = []
    
    avg_score = sum(eval_data.get('score', 0) for eval_data in self.evaluations) / len(self.evaluations) if self.evaluations else 0
    
    if avg_score < 3:
      feedback.append("Significant gaps in fundamental technical knowledge")
    elif avg_score < 6:
      feedback.append("Some technical knowledge present but lacks depth for this role")
    
    for eval_data in self.evaluations:
      feedback.extend(eval_data.get('suggestions', []))
    
    return list(set(feedback)) # Remove duplicates

  async def conduct_full_interview(self):
    """Main method to conduct the complete interview process"""
    try:
      # Mode Selection
      selected_mode = self.choose_chat_mode()
      if selected_mode is None:
        return
      
      print(f" Starting {selected_mode.title()}-Assisted Interview System...")
      
      # Phase 1: Greeting
      if not await self.phase_1_greeting():
        return
      
      # Phase 2: Introduction
      intro_text = await self.phase_2_introduction()
      
      # Generate questions based on introduction
      await self.generate_questions_based_on_intro(intro_text)
      
      # Phase 3: Technical Questions
      await self.phase_3_technical_questions()
      
      # Phase 4: Generate Report
      report = await self.phase_4_generate_report()
      
      print("\n Interview completed successfully!")
      print(f" Overall Score: {report['performance_metrics']['overall_score']}/10")
      print(" Detailed report saved to 'interview_report.json'")
      
    except Exception as e:
      print(f" Error during interview: {e}")
      self.speak("I'm sorry, there was an error during the interview. Please try again.")

async def main():
  """Main entry point"""
  interview_system = VoiceInterviewSystem()
  await interview_system.conduct_full_interview()

if __name__ == '__main__':
  print(" AI Interview System")
  print("=" * 50)
  print("Choose between voice chat or text chat for your interview experience.")
  print("For voice mode: Make sure your microphone is working and you're in a quiet environment.")
  print("=" * 50)
  
  try:
    asyncio.run(main())
  except KeyboardInterrupt:
    print("\n Interview cancelled by user.")
  except Exception as e:
    print(f" Error: {e}")