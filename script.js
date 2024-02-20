const movieSalesURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json'

let movieData; 

let canvas = d3.select('#canvas')
let tooltip = d3.select('#tooltip')

let drawTreeMap = () => {

    let hierarchy = d3.hierarchy(movieData, (node) => {
        return node['children']
    }).sum((node) => {
        return node['value']
    }).sort((node1, node2) => {
        return node2['value'] - node1['value']
    })

    let createTreeMap = d3.treemap()
                          .size([1000, 600])
    createTreeMap(hierarchy)
    let movieTiles = hierarchy.leaves() 
    console.log(movieTiles)

    let block = canvas.selectAll('g')
                      .data(movieTiles)
                      .enter()
                      .append('g')
                      .attr('transform', (movie) => {
                        return 'translate(' + movie['x0'] + ', ' + movie['y0'] + ')'
                      })
    
    block.append('rect')
         .attr('class', 'tile')
         .attr('fill', (movie) => {
            let category = movie['data']['category']
            if (category === 'Action') {
                return '#bccad6'
            } else if (category === 'Drama') {
                return '#8d9db6'
            } else if (category === 'Adventure') {
                return '#667292'
            } else if (category === 'Family') {
                return '#f1e3dd'
            } else if (category === 'Animation') {
                return '#cfe0e8'
            } else if (category === 'Comedy') {
                return '#b7d7e8'
            } else {
                return '#87bdd8'
            }
         })
         .attr('data-name', (movie) => {
            return movie['data']['name']
         })
         .attr('data-value', (movie) => {
            return movie['data']['value']
         })
         .attr('data-category', (movie) => {
            return movie['data']['category']
         })
         .attr('width', (movie) => {
            return movie['x1'] - movie['x0']
         })
         .attr('height', (movie) => {
            return movie['y1'] - movie['y0']
         })
         .each(function(movie) {
            this.addEventListener('mouseover', function(){
                tooltip.transition().style('visibility', 'visible')

                let revenue = movie['data']['value'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                tooltip.text('$' + revenue +  ' - ' + movie['data']['name'] + ' - ' + 'Category: ' + movie['data']['category'])
                tooltip.attr('data-value', movie['data']['value'])
            
            })

            this.addEventListener('mouseout', function(){
                tooltip.transition().style('visibility', 'hidden')
            })
         })

    block.append('text')
         .text((movie) => {
            return movie['data']['name']
         })
         .attr('x', 5)
         .attr('y', 20)
}

d3.json(movieSalesURL).then(
    (data, error) => {
        if(error) {
            console.log(error)
        } else {
            movieData = data
            console.log(movieData)
            drawTreeMap()
        }
    }
)