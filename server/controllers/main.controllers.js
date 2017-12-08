import fs from 'fs'
import path from 'path'
import slug from 'slug'
import { markdown } from 'markdown'


/* Utils */
import get_prompts from '../utils/hotprompts';
import readFiles from '../utils/readfiles'

/* Import config */
const config = require('../config/config.json');

/* Magic that's reading fountain files as strings */
require.extensions['.fountain'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};



/* Home */
export function home(req, res) {
    var settings = fs.readFileSync('./server/content/settings.md','utf8')
    settings = settings.toString().split("\n")
    console.log(settings)
    res.render('index', {config: config, settings})
}

export function topStories(req, res) {
    var timeframe = req.query.time || "all"
    var filename = './server/utils/output/top_stories_'+timeframe+'.json'
    var top_stories = JSON.parse(fs.readFileSync(filename,'utf8'))
    /* Render markdown */
    top_stories = top_stories.map((story)=>{
	story.body = markdown.toHTML(story.body)
	return story
    })
    res.render('stories', {
	stories: top_stories,
	timeframe,
	config
    })
}

export function topAuthors(req, res) {
    var timeframe = req.query.time || "all"
    var filename = './server/utils/output/top_authors_'+timeframe+'.json'
    var top_authors = JSON.parse(fs.readFileSync(filename,'utf8'))
    res.render('authors', {
	authors: top_authors,
	timeframe,
	config
    })
}


export function hotPrompts(req, res) {
    get_prompts((prompts)=>{
	res.render('prompts', { prompts: prompts, config })
    })
}

/* Get all posts */
export function getPosts(req, res) {
    /* Read all files from content directory */    
    readFiles(path.resolve(__dirname, '../content'))
	.then(files => {
	    console.log( `Fetched ${files.length} screenplays`)

	    var allPosts = []
	    files.forEach( (item, index) => {
		if (item.filename.includes('.fountain')) {
		    /* Parse each file, add it to all posts */
		    var md = new ParseMarkdownMetadata(item.contents)
		    var meta = md.props

		    var post = {
			title: meta.title,
			image: meta.image,
			imdb: meta.imdb,
			pdf: meta.pdf,
			author: meta.author.split(",")[0],   		    
			authorslug: slug(meta.author.split(",")[0] || "").toLowerCase(),
			series: meta.series,
			seriesslug: slug(meta.series || "").toLowerCase(),
			slug: item.filename.substring(0, item.filename.lastIndexOf('.'))
		    }

		    if (req.query.query) {
			/* Filter by search query */
			var query = req.query.query
			/* If there's query, only add the posts that have it in meta. */
			query = query.toLowerCase()
			console.log("Query " + query)
			var searchIn = meta.title + meta.author + meta.series
			console.log("Search in " + searchIn)			
			if (searchIn.toLowerCase().includes(query)) {
			    allPosts.push(post)
			}
		    } else if (req.params.author) {
			/* Filter by Author */
			var author = req.params.author
			/* Replace dashes with spaces in slug */
			author = author.replace(/-/g," ")
			if (meta.author.toLowerCase().includes(author)) {
			    allPosts.push(post)
			}
		    } else if (req.params.series) {
			/* Filter by Series */
			var series = req.params.series
			series = series.replace(/-/g," ")
			if (meta.series) {
			    if (meta.series.toLowerCase().includes(series)) {
				allPosts.push(post)
			    }
			}
		    } else {
			allPosts.push(post)
		    }
		} /* End if .fountain */
	    });

	    /* Return list of posts (later I'll render it into a template here. */
	    /* res.json(allPosts) */
	    res.render('index', {posts: allPosts, config })
	})
	.catch( error => {
	    console.log( error );
	});
    

}

/* Get a single post */
export function getPost(req, res) {
    console.log("Fetching post by slug " + req.params.slug)
    const fountainPost = require('../content/'+req.params.slug+'.fountain')

    var md = new ParseMarkdownMetadata(fountainPost)
    var meta = md.props
    
    fountain.parse(fountainPost, (output)=>{
	var post = {
	    title: meta.title,
	    image: meta.image,			
	    slug: req.params.slug,
	    imdb: meta.imdb,
	    pdf: meta.pdf,
	    author: meta.author.split(",")[0],
	    authorslug: slug(meta.author.split(",")[0] || "").toLowerCase(),
	    series: meta.series,
	    seriesslug: slug(meta.series || "").toLowerCase(),
	    titlePage: output.title_page_html,
	    html: output.script_html
	}
	
	res.render('post', {post, config })
    })

}

