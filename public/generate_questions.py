questions = [
    "I am the life of the party.",
    "I feel little concern for others.",
    "I am always prepared.",
    "I get stressed out easily.",
    "I have a rich vocabulary.",
    "I don't talk a lot.",
    "I am interested in people.",
    "I leave my belongings around.",
    "I am relaxed most of the time.",
    "I have difficulty understanding abstract ideas.",
    "I feel comfortable around people.",
    "I insult people.",
    "I pay attention to details.",
    "I worry about things.",
    "I have a vivid imagination.",
    "I keep in the background.",
    "I sympathize with others' feelings.",
    "I make a mess of things.",
    "I seldom feel blue.",
    "I am not interested in abstract ideas.",
    "I start conversations.",
    "I am not interested in other people's problems.",
    "I get chores done right away.",
    "I am easily disturbed.",
    "I have excellent ideas.",
    "I have little to say.",
    "I have a soft heart.",
    "I often forget to put things back in their proper place.",
    "I get upset easily.",
    "I do not have a good imagination.",
    "I talk to a lot of different people at parties.",
    "I am not really interested in others.",
    "I like order.",
    "I change my mood a lot.",
    "I am quick to understand things.",
    "I don't like to draw attention to myself.",
    "I take time out for others.",
    "I shirk my duties.",
    "I have frequent mood swings.",
    "I use difficult words.",
    "I don't mind being the center of attention.",
    "I feel others’ emotions.",
    "I follow a schedule.",
    "I get irritated easily.",
    "I spend time reflecting on things.",
    "I am quiet around strangers.",
    "I make people feel at ease.",
    "I am exacting in my work.",
    "I often feel blue.",
    "I am full of ideas."
]

for i, q in enumerate(questions, start=1):
    print(f'<!-- Question {i} -->')
    print('<div class="question-block">')
    print(f'  <label for="q{i}">{i}. {q}</label><br />')
    for val in range(1, 6):
        required = ' required' if val == 1 else ''
        print(f'  <input type="radio" name="q{i}" value="{val}"{required}> {val}')
    print('</div>\n')
