require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/api/generate-recipes', async (req, res) => {
  try {
    const { ingredients } = req.body;

    // Input validation
    if (!ingredients?.length) {
      return res.status(400).json({ error: "Ingredients array is required" });
    }

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful Malaysian chef that generates recipes in JSON format."
        },
        {
          role: "user",
          content: `Generate 3-5 Malaysian recipes using these ingredients: ${ingredients.join(', ')}.\n\n` +
            "Requirements:\n" +
            "- Cheap and healthy\n" +
            "- Based on the ingredients, display the best recipes, it is not required to use all, can use other ingredients also if it is better\n" +
            "- Include cooking time and cost in RM\n\n" +
            `Response must be in JSON format like this: 
              {
                "recipes": [
                  {
                    "title": "Recipe name",
                    "ingredients": ["list", "of", "ingredients"],
                    "steps": ["step 1", "step 2"],
                    "nutrition": "Nutrition info",
                    "difficulty": "Easy/Medium/Hard",
                    "time": "X mins",
                    "cost": "RM X"
                  }
                ]
        }`
        }
      ],
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const content = JSON.parse(response.data.choices[0].message.content);
    res.json(content.recipes);
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    res.status(500).json({ 
      error: "Recipe generation failed",
      details: error.response?.data?.error?.message || error.message 
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));