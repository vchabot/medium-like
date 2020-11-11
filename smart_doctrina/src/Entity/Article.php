<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\ArticleRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ApiResource(
 *     denormalizationContext={"groups"={"article"}},
 *     itemOperations={
 *         "delete",
 *         "patch",
 *         "put",
 *         "by_tag": {
 *             "method": "GET",
 *             "path": "/articles_by_tag/{name}",
 *             "status": 200,
 *             "controller": ArticlesByTagName::class,
 *             "openapi_context": {
 *                 "summary": "Get every articles by tag name.",
 *                 "parameters": {
 *                     {
 *                         "name": "name",
 *                         "in": "path",
 *                         "required": true,
 *                         "schema": {
 *                             "type": "string"
 *                         }
 *                     }
 *                 }
 *             }
 *         },
 *         "by_keyword": {
 *             "method": "GET",
 *             "path": "/articles_by_keyword/{keyword}",
 *             "status": 200,
 *             "controller": ArticlesByKeyword::class,
 *             "openapi_context": {
 *                 "summary": "Get every articles by keyword.",
 *                 "parameters": {
 *                     {
 *                         "name": "keyword",
 *                         "in": "path",
 *                         "required": true,
 *                         "schema": {
 *                             "type": "string"
 *                         }
 *                     }
 *                 }
 *             }
 *         }
 *     })
 * @ORM\Entity(repositoryClass=ArticleRepository::class)
 */
class Article
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups("article")
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups("article")
     */
    private $reference;

    /**
     * @ORM\Column(type="text")
     * @Groups("article")
     */
    private $content;

    /**
     * @ORM\Column(type="boolean")
     * @Groups("article")
     */
    private $draft;

    /**
     * @ORM\Column(type="datetime")
     * @Groups("article")
     */
    private $createdAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups("article")
     */
    private $updatedAt;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="articles")
     * @ORM\JoinColumn(nullable=false)
     * @Groups("article")
     */
    private $user;

    /**
     * @ORM\OneToMany(targetEntity=Reaction::class, mappedBy="article")
     */
    private $reactions;

    /**
     * @ORM\OneToMany(targetEntity=Comment::class, mappedBy="article")
     */
    private $comments;

    /**
     * @ORM\ManyToMany(targetEntity=Tag::class, inversedBy="articles")
     */
    private $tags;

    public function __construct()
    {
        $this->reactions = new ArrayCollection();
        $this->comments = new ArrayCollection();
        $this->tags = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getReference(): ?string
    {
        return $this->reference;
    }

    public function setReference(string $reference): self
    {
        $this->reference = $reference;

        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): self
    {
        $this->content = $content;

        return $this;
    }

    public function getDraft(): ?bool
    {
        return $this->draft;
    }

    public function setDraft(bool $draft): self
    {
        $this->draft = $draft;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeInterface $updatedAt): self
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    /**
     * @return Collection|Reaction[]
     */
    public function getReactions(): Collection
    {
        return $this->reactions;
    }

    public function addReaction(Reaction $reaction): self
    {
        if (!$this->reactions->contains($reaction)) {
            $this->reactions[] = $reaction;
            $reaction->setArticle($this);
        }

        return $this;
    }

    public function removeReaction(Reaction $reaction): self
    {
        if ($this->reactions->removeElement($reaction)) {
            // set the owning side to null (unless already changed)
            if ($reaction->getArticle() === $this) {
                $reaction->setArticle(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Comment[]
     */
    public function getComments(): Collection
    {
        return $this->comments;
    }

    public function addComment(Comment $comment): self
    {
        if (!$this->comments->contains($comment)) {
            $this->comments[] = $comment;
            $comment->setArticle($this);
        }

        return $this;
    }

    public function removeComment(Comment $comment): self
    {
        if ($this->comments->removeElement($comment)) {
            // set the owning side to null (unless already changed)
            if ($comment->getArticle() === $this) {
                $comment->setArticle(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Tag[]
     */
    public function getTags(): Collection
    {
        return $this->tags;
    }

    public function addTag(Tag $tag): self
    {
        if (!$this->tags->contains($tag)) {
            $this->tags[] = $tag;
        }

        return $this;
    }

    public function removeTag(Tag $tag): self
    {
        $this->tags->removeElement($tag);

        return $this;
    }
}
