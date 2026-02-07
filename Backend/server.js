require("dotenv").config();

const Fastify = require("fastify");
const cors = require("@fastify/cors");
const axios = require("axios");
const db = require("./db");

const fastify = Fastify({logger: true});
fastify.register(cors,{
    origin:true,
});

const getFromOpenAI = async (preference) => {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY not configured");
    }
    
    try {
        console.log("📡 Calling OpenAI API...");
        const response = await axios.post(
            `https://api.openai.com/v1/chat/completions`,
            {
                model: "gpt-3.5-turbo",
                messages: [{
                    role: "user",
                    content: `Suggest exactly 5 movies based on this preference: ${preference}. Return ONLY a comma-separated list of movie names, nothing else.`
                }],
                temperature: 0.7
            },
            {
                timeout: 15000,
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        console.log("✅ OpenAI API response received");
        
        // Check for API errors in response
        if (response.data?.error) {
            console.error("OpenAI API Error:", response.data.error.message);
            throw new Error(`OpenAI API error: ${response.data.error.message}`);
        }
        
        const movieText = response.data?.choices?.[0]?.message?.content;
        if (!movieText) {
            console.error("No movies in response:", JSON.stringify(response.data));
            throw new Error("No content in OpenAI response - check API key validity");
        }
        
        console.log("✅ Movies extracted:", movieText.substring(0, 50) + "...");
        return movieText.trim();
    } catch (error) {
        console.error(" OpenAI API Error Details:");
        console.error("   Status:", error.response?.status);
        console.error("   Message:", error.message);
        if (error.response?.data) {
            console.error("   Response Data:", JSON.stringify(error.response.data));
        }
        throw error;
    }
};

// Fallback movie recommendations database
const getMockRecommendations = (preference) => {
    const mockMovies = {
        action: "John Wick, Mission Impossible, Fast & Furious, Top Gun Maverick, The Matrix Resurrections",
        comedy: "The Grand Budapest Hotel, Superbad, Knives Out, Juno, Bridesmaids",
        romance: "The Notebook, Titanic, La La Land, Pride and Prejudice, Me Before You",
        horror: "The Shining, Get Out, A Quiet Place, Hereditary, Insidious",
        drama: "Forrest Gump, The Shawshank Redemption, Parasite, Moonlight, Oppenheimer",
        sci_fi: "Inception, Interstellar, Blade Runner 2049, Dune, The Matrix Resurrections",
        animation: "Spider-Man: Across the Spider-Verse, Spirited Away, Coco, Inside Out 2, Frozen",
        thriller: "Zodiac, The Sixth Sense, Se7en, Shutter Island, Gone Girl",
        adventure: "Indiana Jones, Avatar, Pirates of the Caribbean, The Lord of the Rings, Jurassic World",
        fantasy: "The Lord of the Rings, Harry Potter, Game of Thrones, The Witcher, Dune"
    };
    
    const preference_lower = preference.toLowerCase();
    for (let key in mockMovies) {
        if (preference_lower.includes(key) || preference_lower.includes(key.replace("_", " "))) {
            return mockMovies[key];
        }
    }
    return mockMovies.drama;
};

fastify.post("/recommend",async(request,reply)=>{
    const {preference }= request.body;
    console.log("\n🎬 New Recommendation Request:", preference);
    
    if(!preference){
        return reply.status(400).send({error:"Preference is required"});
    }
    
    let movies;
    let source = "openai";
    
    try {
        
        console.log("⏳ Attempting OpenAI API...");
        movies = await getFromOpenAI(preference);
        source = "openai";
        console.log(` SUCCESS: OpenAI API generated recommendations`);
        
    } catch (geminiError) {
        console.warn(` FAILED: OpenAI API error - ${geminiError.message}`);
        console.warn(` Attempting fallback recommendations...`);
        
        // Fallback to mock recommendations
        movies = getMockRecommendations(preference);
        source = "fallback";
        console.log(` SUCCESS: Fallback recommendations generated`);
    }
    
    console.log(`Source: ${source.toUpperCase()}`);
    console.log(` Movies: ${movies.substring(0, 60)}...`);
    
    // Save to database regardless of source
    db.run(
        `INSERT INTO recommendations (user_input, recommended_movies) VALUES(?,?)`,
        [preference, movies],
        (err) => {
            if (err) console.error(" Database save failed:", err);
            else console.log(" Saved to database successfully\n");
        }
    );
    
    reply.send({movies, source});
});

fastify.get("/test-openai",async(request,reply)=>{
    console.log("\n Testing OpenAI API...");
    console.log("API Key present:", !!process.env.OPENAI_API_KEY);
    console.log("API Key starts with:", process.env.OPENAI_API_KEY?.substring(0, 10) + "...");
    
    try {
        const testPrompt = "Name 3 famous movies. Return only names separated by commas.";
        console.log("📡 Sending test request to OpenAI...");
        
        const response = await axios.post(
            `https://api.openai.com/v1/chat/completions`,
            {
                model: "gpt-3.5-turbo",
                messages: [{
                    role: "user",
                    content: testPrompt
                }],
                temperature: 0.7
            },
            {
                timeout: 15000,
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        console.log("Response status:", response.status);
        
        if (response.data?.error) {
            console.error("API Error:", response.data.error);
            return reply.code(400).send({
                status: "ERROR",
                message: response.data.error.message || "API Error",
                details: response.data.error
            });
        }
        
        const result = response.data?.choices?.[0]?.message?.content;
        
        if (!result) {
            console.error(" No response text. Full response:", JSON.stringify(response.data, null, 2));
            return reply.code(400).send({
                status: "ERROR",
                message: "No content in response",
                response: response.data
            });
        }
        
        console.log("Test successful! Response:", result);
        
        return reply.send({
            status: "SUCCESS",
            message: "OpenAI API is working!",
            result: result,
            apiKeyValid: true
        });
        
    } catch (error) {
        console.error("Test failed:");
        console.error("Error message:", error.message);
        console.error("Status code:", error.response?.status);
        console.error("Error data:", error.response?.data);
        
        return reply.code(500).send({
            status: "ERROR",
            message: error.message,
            statusCode: error.response?.status,
            errorData: error.response?.data,
            helpText: "Check your API key at https://platform.openai.com/api-keys"
        });
    }
});

fastify.get("/",async()=>{
    return {message:"Welcome to the Movie Recommendation API"};
});

const start = async ()=>{
    try {
        await fastify.listen({port: process.env.PORT || 5000, host:"0.0.0.0"});
        console.log("server running");
        host: "0.0.0.0",
        
    } catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
};

start();